import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();

    // 1️⃣ 쿠키에서 accessToken 가져오기
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: "Unauthorized: No access token found in cookies" },
        { status: 401 },
      );
    }

    // 2️⃣ Supabase 클라이언트 생성
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}1`, // ✅ 쿠키 기반 인증
          },
        },
      },
    );

    // 3️⃣ 현재 로그인한 사용자 정보 가져오기
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid or expired access token" },
        { status: 401 },
      );
    }

    // 4️⃣ users 테이블에서 해당 사용자가 이미 존재하는지 확인
    const { data: existingUser, error: userCheckError } = await supabase
      .from("users")
      .select("id, email") // PK(id)도 함께 조회하여 중복 확인
      .eq("email", user.email)
      .maybeSingle(); // `.maybeSingle()` 사용 (없으면 null 반환)

    console.log("Existing user:", existingUser);

    // 5️⃣ 유저가 이미 존재하는 경우 (가입된 상태)
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists", email: existingUser.email },
        { status: 200 },
      );
    }

    // 6️⃣ 새 유저 정보 생성 후 DB에 추가
    const { error: insertError } = await supabase
      .from("users")
      .insert([
        {
          email: user.email,
          type: user.app_metadata?.provider.toUpperCase(),
          role: "USER",
        },
      ])
      .select(); // ✅ ID를 반환하도록 설정

    // 7️⃣ 삽입 오류 처리
    if (insertError) {
      console.error("User registration failed:", insertError);
      if (insertError.code === "23505") {
        return NextResponse.json(
          { message: "User already exists (Duplicate entry detected)" },
          { status: 409 }, // 409 Conflict 응답 코드 사용
        );
      }
      return NextResponse.json(
        { message: `User registration failed: ${insertError.message}` },
        { status: 500 },
      );
    }

    // 8️⃣ 성공 응답 반환
    return NextResponse.json(
      { message: "User registered successfully", userId: user.id },
      { status: 201 },
    );
  } catch (err: any) {
    console.error("Server Error:", err);

    return NextResponse.json(
      { message: `Server error: ${err.message || "Unknown error"}` },
      { status: 500 },
    );
  }
}
