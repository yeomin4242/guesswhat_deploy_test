"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import { Provider, createClient } from "@supabase/supabase-js";
import { useState } from "react";
import { GuessWhatLogo } from "@/components/guess-what-logo";
import { main, title } from "@/styles/primitives";
import { clsx } from "@/utils/clsx";

interface AuthOauthButtonProps {
  provider: Provider;
  redirectUri: string;
  buttonSize: string;
}

export default function LoginPage() {
  return (
    <main
      className={main({
        padding: "lg",
        display: "flex",
        flexDirection: "col",
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      <Card className="min-w-[360px]">
        <CardHeader className="flex-col justify-center gap-4">
          <GuessWhatLogo className="h-8 w-8" />
          <div
            className={clsx([
              title({
                size: "sm",
              }),
              "text-left",
            ])}
          >
            Ear We Go!
          </div>
        </CardHeader>
        <CardBody className="flex min-h-32 items-center justify-center">
          Explore different quizzes
        </CardBody>
        <CardFooter className="flex-col gap-6 p-5">
          <OAuthSocialLogin
            provider="google"
            redirectUri={process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI}
            buttonSize="w-96"
          />
          <OAuthSocialLogin
            provider="facebook"
            redirectUri={process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI}
            buttonSize="w-96"
          />
        </CardFooter>
      </Card>
    </main>
  );
}

function OAuthSocialLogin({
  provider,
  redirectUri,
  buttonSize,
}: AuthOauthButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUri,
      },
    });

    if (error) {
      console.error("OAuth 로그인 실패:", error);
      setLoading(false);
      return;
    }

    if (data.url) {
      window.location.href = data.url; // 받은 URL로 이동
    } else {
      console.error("OAuth URL이 존재하지 않습니다.");
      setLoading(false);
    }
  };

  return (
    <Button
      onPress={handleLogin}
      isDisabled={loading}
      className={`${buttonSize} flex items-center justify-center rounded-lg ${
        loading ? "cursor-not-allowed opacity-50" : ""
      }`}
    >
      <span className="font-normal">
        {loading
          ? "Loading..."
          : `Continue with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
      </span>
    </Button>
  );
}
