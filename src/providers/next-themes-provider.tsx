"use client";

import { ThemeProvider } from "next-themes";
import { useIsMounted } from "@/hooks/use-is-mounted";

const NextThemesProvider = ({ children }: { children: React.ReactNode }) => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      {children}
    </ThemeProvider>
  );
};

export default NextThemesProvider;
