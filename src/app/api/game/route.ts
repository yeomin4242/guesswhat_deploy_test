import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase-server";
import { isArray, isString } from "@/utils/assertion";

// 필터 문자열 매핑

// Supabase 쿼리 생성 함수
async function BuildQuery(
  supabase: SupabaseClient,
  filterParam: string,
  size: number,
  offset: number,
  keyword?: string,
) {
  let query = supabase
    .from("games")
    .select(
      `
        id,
        title,
        description,
        thumbnail_url,
        creator_id,
        created_at,
        tags,
        users:creator_id ( id, email )
      `,
      { count: "exact" },
    )
    .eq("is_visible", true);

  // filterParam에 따른 정렬 추가
  switch (filterParam.toLowerCase()) {
    case "latest":
      // 최신순으로 정렬 (created_at 기준 내림차순)
      query = query.order("created_at", { ascending: false });
      break;
    case "popularity":
      // 인기순으로 정렬 (title 기준 오름차순 예시 - 필요 시 다른 컬럼으로 변경)
      query = query
        .order("title", { ascending: true })
        .order("id", { ascending: true }); // 같은 title일 경우 id로 정렬
      // NOTE: PostgreSQL에서는 ORDER BY 절에 중복된 컬럼이 (여기선 title) 있을 경우, 해당 컬럼의 위치는 임의로 변경될 수 있음. 이 경우, id로 정렬하여 순서를 보장
      break;
    // recommended(추천순)는 votes 기준으로 JS에서 다시 정렬하므로 여기서는 별도 처리하지 않음
    default:
      // 기본 정렬이 필요하다면 여기서 설정
      break;
  }

  // 페이징 처리
  query = query.limit(size).range(offset, offset + size - 1);

  // 키워드 필터 추가
  if (keyword) {
    query = query.ilike("title", `%${keyword}%`);
  }

  return query;
}

// Votes 수를 가져오는 함수
async function FetchVoteCounts(supabase: SupabaseClient, gameIds: string[]) {
  if (gameIds.length === 0) return {};

  const { data, error } = await supabase.rpc("count_votes_by_game", {
    game_ids: gameIds, // RPC 함수에 배열 전달
  });

  if (error) {
    console.error("Error fetching vote counts:", error.message);
    return {};
  }

  // 투표 수를 객체로 변환 (key: game_id, value: count)
  return data.reduce(
    (
      acc: Record<string, number>,
      { game_id, count }: { game_id: string; count: number },
    ) => {
      acc[game_id] = count;
      return acc;
    },
    {} as Record<string, number>,
  );
}

// API GET 핸들러
export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // 쿼리 파라미터 파싱
    const { searchParams } = new URL(request.url);
    const sizeParam = searchParams.get("size") ?? "20";
    const pageParam = searchParams.get("page") ?? "1";
    const filterParam = searchParams.get("filter") ?? "recommended";
    const keyword = searchParams.get("keyword") ?? "";

    const size = parseInt(sizeParam, 10);
    const page = parseInt(pageParam, 10);
    const offset = (page - 1) * size;

    // 1. 기본 게임 데이터 가져오기
    const query = await BuildQuery(
      supabase,
      filterParam,
      size,
      offset,
      keyword,
    );

    if (query.error) {
      console.error("Error executing query:", query.error);
      return NextResponse.json({ error: query.error.message }, { status: 500 });
    }

    const games = query.data || [];
    const gameIds = games.map((game: any) => game.id);

    // 2. Votes 데이터 가져오기
    const voteCounts = await FetchVoteCounts(supabase, gameIds);

    // 3. Votes 기준 정렬 (Recommended)
    if (filterParam.toLowerCase() === "recommended") {
      games.sort((a: any, b: any) => {
        const votesA = voteCounts[a.id] || 0;
        const votesB = voteCounts[b.id] || 0;
        return votesB - votesA; // Descending order
      });
    }

    // 4. 전체 페이지 수 계산
    const totalNumber = query.count ?? 0;
    const totalPage = Math.ceil(totalNumber / size);

    // 5. 게임 데이터를 변환
    //TODO: game 타입 수정
    const result = games.map((game: any) => {
      const tags = (() => {
        if (!game?.tags) {
          // game 또는 game.tag가 null/undefined인 경우 null 반환
          return null;
        }

        if (isString(game.tags)) {
          // 문자열일 경우 쉼표로 분리 후 공백 제거
          return game.tags.split(",").map((tag) => tag.trim());
        }

        if (isArray(game.tags)) {
          // 이미 배열인 경우, 문자열인지 확인 후 공백 제거
          return game.tags
            .filter((tag) => typeof tag === "string") // 문자열인 요소만 포함
            .map((tag) => tag.trim());
        }

        // 그 외의 경우 null 반환
        return null;
      })();

      return {
        gameId: game.id,
        thumbnailUrl: game.thumbnail_url,
        title: game.title,
        tags, // 안전하게 처리된 tags
        creator: game.users?.email || "Anonymous",
        votes: voteCounts[game.id] || 0, // 투표 수 추가
      };
    });

    return NextResponse.json(
      {
        size,
        page,
        totalPage,
        totalNumber,
        games: result,
      },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("Error in GET handler:", err.message);
    return NextResponse.json(
      { error: err.message || "Unknown Error" },
      { status: 500 },
    );
  }
}
