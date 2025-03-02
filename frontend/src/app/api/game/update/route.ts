//import { createClient } from "@/libs/supabase-server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { UpdateGameRequestDto } from "@/types/dto/game/request";
import { processGameImages, validateGameData } from "@/utils/game-operations";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const requestHeaders = new Headers(request.headers);

    const accessToken = cookieStore.get("accessToken")?.value;

    // Supabase 클라이언트 생성 (Authorization 헤더 포함)
    const supabase = await createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`, // ✅ JWT 포함
          },
        },
      },
    );

    // 요청 본문 파싱
    const body = await request.json();
    const {
      gameId,
      thumbnailUrl,
      title,
      description,
      tags,
      isVisible,
      questions,
    } = body as UpdateGameRequestDto;

    // 1️⃣ 데이터 검증
    const validationError = validateGameData(body);
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    // 2️⃣ 이미지 처리
    const { finalCoverUrl, finalQuestions } = await processGameImages(
      thumbnailUrl,
      questions,
    );

    // 3️⃣ 게임 업데이트
    const { data: updatedGame, error: updateError } = await supabase
      .from("games")
      .update({
        title,
        thumbnail_url: finalCoverUrl,
        tags,
        description,
        is_visible: isVisible,
        updated_at: new Date().toISOString(),
      })
      .eq("id", gameId)
      .eq("creator_id", parseInt(requestHeaders.get("x-user-id")))
      .select(
        "id, title, thumbnail_url, tags, description, is_visible, created_at, updated_at",
      )
      .single();

    if (updateError) {
      console.error("게임 정보 업데이트 실패:", updateError);

      // 4️⃣ JWSError 처리 (JWT 인증 오류)
      if (updateError.code.includes("PGRST1")) {
        return NextResponse.json(
          { message: "인증 실패: 잘못된 JWT 서명입니다." },
          { status: 401 },
        );
      }

      // 5️⃣ SQL 오류 처리 (컬럼이 없거나 잘못된 요청)
      if (
        updateError.message.includes("column") ||
        updateError.code === "42703"
      ) {
        return NextResponse.json(
          { message: "잘못된 요청: SQL 오류 (컬럼이 존재하지 않음)" },
          { status: 400 },
        );
      }

      return NextResponse.json(
        { message: `게임 정보 업데이트 실패: ${updateError.message}` },
        { status: 500 },
      );
    }

    if (!updatedGame) {
      return NextResponse.json(
        { message: "업데이트된 게임 데이터를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 6️⃣ 기존 게임 속성 삭제 후 새 데이터 삽입
    const gamePropsData = finalQuestions.map((question) => ({
      game_id: gameId,
      question: question.question,
      question_url: question.questionUrl,
      answer_url: question.answerUrl,
      answer: question.answer,
      updated_at: new Date().toISOString(),
    }));

    // 기존 game_props 데이터 삭제
    const { error: deleteError } = await supabase
      .from("game_props")
      .delete()
      .eq("game_id", gameId);

    if (deleteError) {
      return NextResponse.json(
        { message: `기존 게임 속성 삭제 실패: ${deleteError.message}` },
        { status: 500 },
      );
    }

    // 새 게임 속성 데이터 삽입
    const { error: insertError } = await supabase
      .from("game_props")
      .insert(gamePropsData);

    if (insertError) {
      return NextResponse.json(
        { message: `게임 속성 삽입 실패: ${insertError.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({
      data: {
        gameId,
        thumbnailUrl: finalCoverUrl,
        title,
        description,
        tags,
        isVisible,
        createdAt: updatedGame.created_at,
        updatedAt: updatedGame.updated_at,
        questions: finalQuestions,
      },
    });
  } catch (err: any) {
    console.error("서버 에러:", err);

    // 7️⃣ JWT 관련 예외 처리 (토큰 만료, 잘못된 토큰 등)
    if (err.message.includes("JWSError")) {
      return NextResponse.json(
        { message: "인증 실패: JWT 오류가 발생했습니다." },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { message: `서버 에러: ${err.message || "알 수 없는 에러"}` },
      { status: 500 },
    );
  }
}
