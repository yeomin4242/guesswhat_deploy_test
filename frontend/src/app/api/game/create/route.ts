import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CreateGameRequestDto } from "@/types/dto/game/request";
import { processGameImages, validateGameData } from "@/utils/game-operations";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${cookieStore.get("accessToken")}`, // ✅ 쿠키에서 가져옴
          },
        },
      },
    );
    const body: CreateGameRequestDto = await request.json();
    const { thumbnailUrl, title, description, tags, creatorId, questions } =
      body;

    // Validate input data
    const validationError = validateGameData(body);
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    // Process images (move from temp to final)
    const { finalCoverUrl, finalQuestions } = await processGameImages(
      thumbnailUrl,
      questions,
    );

    // Insert game data
    const { data: gameData, error: gameError } = await supabase
      .from("games")
      .insert([
        {
          creator_id: parseInt(creatorId, 10),
          title,
          description,
          thumbnail_url: finalCoverUrl,
          type: "PHOTO", // TODO: type을 받아서 처리
          tags: tags, // PostgreSQL 배열로 전달
          is_visible: true,
        },
      ])
      .select("id"); // 삽입된 게임의 id 반환

    if (gameError) {
      return NextResponse.json(
        { message: `게임 생성 실패: ${gameError.message}` },
        { status: 500 },
      );
    }

    const gameId = gameData[0]?.id;

    // Insert game properties (questions)
    const questionsData = finalQuestions.map((q) => ({
      game_id: gameId,
      question: q.question,
      question_url: q.questionUrl,
      answer_url: q.answerUrl,
      answer: q.answer,
    }));

    const { error: propsError } = await supabase
      .from("game_props")
      .insert(questionsData);

    if (propsError) {
      return NextResponse.json(
        { message: `게임 속성 생성 실패: ${propsError.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "성공적으로 생성되었습니다!" },
      { status: 201 },
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: `서버 에러: ${err.message || "알 수 없는 에러"}` },
      { status: 500 },
    );
  }
}
