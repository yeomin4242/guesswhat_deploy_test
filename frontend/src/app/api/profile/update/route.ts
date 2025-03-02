import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase-server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { userId, email } = body;

    if (!userId || !email) {
      return NextResponse.json(
        { message: "userId와 email을 모두 입력해야 합니다." },
        { status: 400 },
      );
    }

    // 1. 유저 확인
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { message: "유저를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 2. 이메일 업데이트
    const { error: updateError } = await supabase
      .from("users")
      .update({ email })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json(
        { message: `이메일 업데이트 실패: ${updateError.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ email });
  } catch (err: any) {
    return NextResponse.json(
      { message: `서버 에러: ${err.message || "알 수 없는 에러"}` },
      { status: 500 },
    );
  }
}
