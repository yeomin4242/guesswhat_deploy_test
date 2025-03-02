"use client";

import { Button } from "@nextui-org/react";
import { createClient } from "@supabase/supabase-js";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// 쿠키 관리 라이브러리 추가

export default function OAuthLoginRedirectPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState(false); // 로그인 실패 상태 추가
  const router = useRouter();
  const cookies = useCookies();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (accessToken && refreshToken) {
      // ✅ 쿠키에 토큰 저장 (보안: HTTPOnly 쿠키는 서버에서 설정하는 것이 이상적)
      cookies.set("accessToken", accessToken, { expires: 1 }); // 1일 유지
      cookies.set("refreshToken", refreshToken, { expires: 7 }); // 7일 유지

      // ✅ URL에서 accessToken 제거 (보안 강화)
      router.replace("/login/redirect");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchUserAndRegister = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            global: {
              headers: {
                Authorization: `Bearer ${cookies.get("accessToken")}`, // ✅ 쿠키에서 가져옴
              },
            },
          },
        );

        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
          console.log("Error fetching user:", error);
          setLoginError(true);
          return;
        }

        setUser(data.user);

        // ✅ 자동 회원가입 API 호출
        const response = await fetch("/api/auth/oauth/register", {
          method: "POST",
          credentials: "include", // ✅ 쿠키 자동 포함
        });

        if (!response.ok) {
          // 🛑 응답이 실패했을 때 JSON을 안전하게 파싱
          let errorMessage = "User registration failed.";
          try {
            const errorResponse = await response.json();
            errorMessage = errorResponse.message || errorMessage;
          } catch (jsonError) {
            console.log("Failed to parse error response:", jsonError);
          }
          console.log(errorMessage);
          setLoginError(true);
          return;
        }

        // ✅ 200~299 응답이면 홈으로 이동
        router.push("/");
      } catch (err) {
        console.log("Unexpected error:", err);
        setLoginError(true);
      } finally {
        setLoading(false);
      }
    };

    if (cookies.get("accessToken")) {
      fetchUserAndRegister();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      {user && !loginError ? (
        <></>
      ) : (
        <div>
          <h1>Failed to Login</h1>
          <Button>
            <Link href="/">Back to main</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
