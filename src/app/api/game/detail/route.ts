import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase-server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

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
        creator_id,
        created_at
      `,
      )
      .eq("id", Number(gameId))
      .single();

    if (gameError) {
      return NextResponse.json(
        { error: `게임 정보를 불러올 수 없습니다: ${gameError.message}` },
        { status: 500 },
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
      .eq("game_id", Number(gameId))
      .order("id", { ascending: false }) // Ensures consistent ordering before applying randomization
      .limit(50)
      .then((response) => {
        const shuffled = response.data?.toSorted(() => Math.random() - 0.5);
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
      thumbnailUrl: gameData.thumbnail_url,
      title: gameData.title,
      description: gameData.description,
      questions: questionsData.map((question: any) => ({
        question: question.question,
        questionId: question.id,
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
