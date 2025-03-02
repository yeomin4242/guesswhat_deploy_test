"use client";

import {
  Button,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUINavBar,
  link,
} from "@nextui-org/react";
import { getCookies } from "next-client-cookies/server";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { FC, memo, useEffect, useState } from "react";
import { ThemeSwitch } from "@/components/theme-switch";
import { clsx } from "@/utils/clsx";
import { GuessWhatLogo } from "./guess-what-logo";

interface MenuItems {
  label: string;
  href: string;
  disabled?: boolean;
}

const menuItems: MenuItems[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
];

const navLinkClasses = clsx(
  link({ color: "foreground", size: "lg", underline: "hover" }),
  "data-[active=true]:text-primary",
);

export interface NavbarProps {}

const NavBar: FC<NavbarProps> = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean | undefined>(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [pathname]);

  return (
    <NextUINavBar
      className={clsx({
        "z-[100001]": isMenuOpen,
      })}
      maxWidth="2xl"
      position="sticky"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      isBordered
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand>
          <NextLink
            aria-label="Home"
            className="flex items-center justify-start gap-2 transition-opacity tap-highlight-transparent active:opacity-50"
            href="/"
          >
            <GuessWhatLogo className="h-8 w-8" />
            <p className="text-3xl font-semibold text-inherit">GuessWhat</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden items-center justify-start gap-6 lg:flex">
          {menuItems.map(({ label, href, disabled }, index) => (
            <NavbarMenuItem key={`${label}-${index}`}>
              <NextLink
                className={clsx([
                  navLinkClasses,
                  disabled && "pointer-events-none no-underline",
                ])}
                color="foreground"
                data-active={pathname === href}
                href={href}
              >
                {label}
              </NextLink>
            </NavbarMenuItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent className="flex w-full gap-2 sm:hidden" justify="end">
        <NavbarItem className="flex h-full items-center">
          <Button color="primary" size="sm">
            <NextLink color="foreground" href="/login">
              Login
            </NextLink>
          </Button>
        </NavbarItem>
        <NavbarItem className="flex h-full items-center">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="h-full w-10">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="h-full w-full pt-1"
          />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent
        className="hidden basis-1/5 sm:flex sm:basis-full"
        justify="end"
      >
        <NavbarItem className="flex h-full items-center">
          <Button color="primary" size="sm">
            <NextLink color="foreground" href="/login">
              Login
            </NextLink>
          </Button>
        </NavbarItem>
        <NavbarItem className="hidden sm:flex">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="ml-4 hidden sm:flex lg:hidden"
        />
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map(({ label, href, disabled }, index) => (
          <NavbarMenuItem key={`${label}-${index}`}>
            <NextLink
              className={clsx([
                navLinkClasses,
                disabled && "pointer-events-none no-underline",
              ])}
              color="foreground"
              data-active={pathname === href}
              href={href}
            >
              {label}
            </NextLink>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </NextUINavBar>
  );
});

NavBar.displayName = "[GuessWhat]NavBar";

//TOOD: 추후 로그아웃 기능 추가
//export async  function LogoutButton() {
//  const cookies = await getCookies();

//  return (
//    <button className="bg-red-500 text-white px-4 py-2 rounded">
//      Logout
//    </button>
//  );
//}

export default NavBar;
