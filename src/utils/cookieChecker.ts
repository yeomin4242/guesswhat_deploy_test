"use client";

import { useCookies } from "next-client-cookies";

export function checkCookieByCSR(cookieName: string): boolean {
  const cookies = useCookies();

  if (!cookies.get(cookieName)) {
    return false;
  }
  return true;
}
