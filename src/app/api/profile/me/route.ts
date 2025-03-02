import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase-server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // 1. 쿼리 파라미터 파싱
    const { searchParams } = new URL(request.url);
    //TODO: 추후에 jwt로 변경예정
    const userId = searchParams.get("userId") ?? "1";

    if (!userId || !Number(userId)) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    // 2. users 테이블에서 유저 정보 조회
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("email")
      .eq("id", Number(userId))
      .single();

    if (userError) {
      return NextResponse.json(
        { error: `유저 정보를 불러올 수 없습니다: ${userError.message}` },
        { status: 500 },
      );
    }

    // 3. game_props 테이블에서 게임 정보 및 질문 수 조회
    const { data: gameData, error: gameError } = await supabase
      .from("games")
      .select(
        `
        id,
        title,
        tags,
        thumbnail_url,
        is_visible,
        created_at,
        updated_at
      `,
      )
      .eq("creator_id", Number(userId))
      .order("created_at", { ascending: false })
      .limit(5);

    console.log(gameError);

    if (gameError) {
      return NextResponse.json(
        { error: `게임 정보를 불러올 수 없습니다: ${gameError.message}` },
        { status: 500 },
      );
    }

    // 4. 질문 개수를 계산하여 데이터 포맷 정리
    const formattedGameData = gameData.map((game: any) => ({
      gameId: game.id,
      title: game.title,
      tags: game.tags,
      thumbnailUrl: game.thumbnail_url,
      isVisible: game.is_visible,
      createdAt: game.created_at,
      updatedAt: game.updated_at,
    }));

    // 5. 응답 데이터 형식화
    const response = {
      email: userData.email,
      games: formattedGameData,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: `서버 에러: ${err.message || "알 수 없는 에러"}` },
      { status: 500 },
    );
  }
}
