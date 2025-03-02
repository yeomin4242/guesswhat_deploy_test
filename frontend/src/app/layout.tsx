import { GoogleAnalytics } from "@next/third-parties/google";
import { NextUIProvider } from "@nextui-org/system";
import type { Metadata } from "next";
import { CookiesProvider } from "next-client-cookies/server";
import NavBar from "@/components/navbar";
import "@/fonts/pretendardvariable.css";
import NextThemesProvider from "@/providers/next-themes-provider";
import "./globals.css";

// Static metadata
// TODO: Replace with dynamic metadata for SEO
export const metadata: Metadata = {
  authors: [{ name: "GuessWhat", url: "" }],
  creator: "GuessWhat",
  description: "Guess What: Can you guess what it is?",
  title: "Guess What: Can you guess what it is?",
  keywords: ["Guessing game", "Guess What"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: new URL("https://guess-what.com"),
    title: "Guess What: Can you guess what it is",
    siteName: "Which UI",
    description: "Guess What: Can you guess what it is?",
    images: [
      {
        url: new URL("https://guess-what.com/images/og-image.png"), // TODO: Replace with real && dynamic image
        width: 1200,
        height: 630,
        alt: "Guess What: Can you guess what it is",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background">
        <NextUIProvider>
          <NextThemesProvider>
            <CookiesProvider>
              <NavBar />
              {children}
            </CookiesProvider>
          </NextThemesProvider>
        </NextUIProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  );
}
