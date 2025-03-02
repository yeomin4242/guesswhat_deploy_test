import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const requestHeaders = new Headers(request.headers);

    // 1️⃣ Authorization 헤더 또는 쿠키에서 accessToken 가져오기
    const authHeader = requestHeaders.get("Authorization");
    const cookieToken = cookieStore.get("accessToken")?.value;
    const accessToken = authHeader?.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "")
      : cookieToken;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized: No access token found." },
        { status: 401 },
      );
    }

    // 2️⃣ Supabase 클라이언트 생성 (Authorization 헤더 포함)
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

    // 1. 쿼리 파라미터 파싱
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("gameId");

    if (!gameId) {
      return NextResponse.json(
        { error: "gameId is required" },
        { status: 400 },
      );
    }

    // 2. games 테이블에서 게임 정보 조회
    const { data: gameData, error: gameError } = await supabase
      .from("games")
      .select(
        `
        id,
        title,
        description,
        thumbnail_url,
        tags,
        is_visible,
        creator_id,
        created_at
      `,
      )
      .eq("creator_id", parseInt(requestHeaders.get("x-user-id")))
      .eq("id", gameId)
      .single();

    if (gameError) {
      console.error("게임 정보 업데이트 실패:", gameError);

      // 4️⃣ JWSError 처리 (JWT 인증 오류)
      if (gameError.code.includes("PGRST1")) {
        return NextResponse.json(
          { message: "인증 실패: 잘못된 JWT 서명입니다." },
          { status: 401 },
        );
      }

      // 5️⃣ SQL 오류 처리 (컬럼이 없거나 잘못된 요청)
      if (gameError.message.includes("column") || gameError.code === "42703") {
        return NextResponse.json(
          { message: "잘못된 요청: SQL 오류 (컬럼이 존재하지 않음)" },
          { status: 400 },
        );
      }

      return NextResponse.json(
        { message: `게임 정보 업데이트 실패: ${gameError.message}` },
        { status: 500 },
      );
    }

    if (!gameError) {
      return NextResponse.json(
        { message: "업데이트된 게임 데이터를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 3. game_props 테이블에서 관련 질문 조회
    const { data: questionsData, error: questionsError } = await supabase
      .from("game_props")
      .select(
        `
        id,
        question_url,
        question,
        answer_url,
        answer
      `,
      )
      .eq("game_id", gameId)
      .order("id", { ascending: false }) // Ensures consistent ordering before applying randomization
      .limit(50)
      .then((response) => {
        const shuffled = response.data?.sort(() => Math.random() - 0.5);
        return { data: shuffled, error: response.error };
      });

    if (questionsError) {
      return NextResponse.json(
        { error: `질문 정보를 불러올 수 없습니다: ${questionsError.message}` },
        { status: 500 },
      );
    }

    // 4. 응답 데이터 형식화
    const response = {
      gameId: gameData.id,
      thumbnailUrl: gameData.thumbnail_url,
      title: gameData.title,
      description: gameData.description,
      tags: gameData.tags,
      isVisible: gameData.is_visible,
      questions: questionsData.map((question) => ({
        questionId: question.id,
        question: question.question,
        questionUrl: question.question_url,
        answer: question.answer,
        answerUrl: question.answer_url,
      })),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: `서버 에러: ${err.message || "알 수 없는 에러"}` },
      { status: 500 },
    );
  }
}
