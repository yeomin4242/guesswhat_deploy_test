import { tv } from "tailwind-variants";

export const main = tv({
  base: "min-h-[calc(100vh_-_64px)] w-screen mx-auto max-w-7xl flex-grow",
  variants: {
    padding: {
      none: "px-0",
      sm: "px-4",
      md: "px-8",
      lg: "px-12",
    },
    display: {
      flex: "flex",
      block: "block",
      inlineFlex: "inline-flex",
    },
    flexDirection: {
      row: "flex-row",
      col: "flex-col",
    },
    alignItems: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
    justifyContent: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
  },
  defaultVariants: {
    padding: "sm",
  },
});

export const searchBarWrapper = tv({
  base: "my-8 flex flex-col items-center justify-center w-full",
  variants: {
    padding: {
      sm: "px-4",
      md: "px-6",
      lg: "px-8",
    },
  },
  defaultVariants: {
    padding: "sm",
  },
});

export const titleWrapper = tv({
  base: "my-8 flex flex-col items-center justify-center",
});

export const title = tv({
  base: "tracking-tight inline font-semibold",
  variants: {
    color: {
      violet: "from-[#FF1CF7] to-[#b249f8]",
      yellow: "from-[#FF705B] to-[#FFB457]",
      blue: "from-primary to-[#0072F5] dark:text-blue-300",
      cyan: "from-[#00b7fa] to-[#01cfea]",
      green: "from-[#6FEE8D] to-[#17c964]",
      pink: "from-[#FF72E1] to-[#F54C7A]",
      foreground: "dark:from-[#FFFFFF] dark:to-[#4B4B4B]",
    },
    size: {
      "2xs": "text-base lg:text-lg",
      xs: "text-xl lg:text-2xl",
      sm: "text-3xl lg:text-4xl",
      md: "text-[2.5rem] lg:text-5xl",
      lg: "text-4xl lg:text-6xl",
      xl: "text-5xl md:text-6xl lg:text-7xl",
    },
    fullWidth: {
      true: "w-full block",
    },
  },
  defaultVariants: {
    size: "md",
  },
  compoundVariants: [
    {
      color: [
        "violet",
        "yellow",
        "blue",
        "cyan",
        "green",
        "pink",
        "foreground",
      ],
      class: "bg-clip-text text-transparent bg-gradient-to-b",
    },
  ],
});

export const subtitle = tv({
  base: "w-full md:w-1/2 my-2 text-lg lg:text-xl font-normal text-default-500 block max-w-full",
  variants: {
    size: {
      "2xs": "text-xs lg:text-sm",
      xs: "text-sm lg:text-base",
      sm: "text-base lg:text-lg",
      md: "text-lg lg:text-xl",
      lg: "text-xl lg:text-2xl",
      xl: "text-2xl md:text-3xl lg:text-4xl",
    },
    fullWidth: {
      true: "!w-full",
    },
  },
  defaultVariants: {
    size: "md",
  },
});
