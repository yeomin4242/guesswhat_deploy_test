"use client";

import { Button } from "@nextui-org/react";
import Link from "next/link";
import { main, title } from "@/styles/primitives";
import { clsx } from "@/utils/clsx";

const NotFound = () => {
  return (
    <main
      className={clsx([
        main({ padding: "lg" }),
        "flex flex-col items-center justify-center",
        "max-sm:px-4",
      ])}
    >
      <div className="flex flex-col items-center gap-8 text-start leading-8 md:text-left md:leading-10">
        <div className="inline-block">
          <h1 className={title({ color: "blue", size: "xl" })}>404</h1>
          <br />
          <h1 className={title({ size: "sm" })}>Page Not Found</h1>
        </div>
        <Link href="/" className="w-full">
          <Button size="lg" color="primary" variant="shadow" fullWidth>
            Go Back to Main
          </Button>
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
