import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1️⃣ 인증 및 유저 정보 검증 클래스
class GameAuthGuard {
  // 보호할 API 경로 목록
  private static readonly protectedPaths = [
    "/api/game/create",
    "/api/game/edit",
    "/api/game/update",
  ];

  /**
   * @desc 요청이 보호 대상 경로인지 확인하고, 유저 인증 및 정보 조회
   * @return NextResponse | null
   * - 인증 실패 시: NextResponse(401)
   * - 정상 통과 시: null
   */
  static async checkAndFetchUser(
    request: NextRequest,
  ): Promise<NextResponse | null> {
    // 1️⃣ 보호된 경로인지 확인
    const isProtected = GameAuthGuard.protectedPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path),
    );
    if (!isProtected) return null;

    // 2️⃣ 요청 헤더 또는 쿠키에서 accessToken 가져오기
    const authHeader = request.headers.get("Authorization");
    const cookieToken = request.cookies.get("accessToken");
    let accessToken = authHeader?.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "")
      : cookieToken;

    if (!accessToken) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized: No access token found." }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    // 3️⃣ Supabase Auth API로 유저 정보 조회
    const user = await GameAuthGuard.fetchSupabaseUser(accessToken["value"]);
    if (!user || !user.id) {
      return new NextResponse(
        JSON.stringify({
          message: "Unauthorized: Invalid access token or user not found.",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    // 4️⃣ 유저 정보를 커스텀 헤더에 포함하여 라우트로 전달
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", user.id);
    requestHeaders.set("x-user-email", user.email || "");

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  /**
   * @desc Supabase Auth API를 사용하여 유저 정보 조회
   * @param accessToken - Supabase 인증 토큰
   * @returns 유저 정보 (ID, Email 등)
   */
  private static async fetchSupabaseUser(accessToken: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase URL or Anon Key is not defined.");
      return null;
    }

    try {
      const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        console.error(
          "Failed to fetch user from Supabase Auth:",
          await res.text(),
        );
        return null;
      }

      return res.json(); // { id, email, ... }
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }
}

// 2️⃣ 미들웨어 본체
export async function middleware(request: NextRequest) {
  const guardResponse = await GameAuthGuard.checkAndFetchUser(request);
  if (guardResponse) {
    return guardResponse;
  }

  return NextResponse.next();
}

// 3️⃣ 미들웨어 적용할 경로 설정
export const config = {
  matcher: ["/api/game/:path*"],
};
