"use client";

import { Input } from "@nextui-org/react";
import { memo, useRef } from "react";
import { SearchLinearIcon as SearchIcon } from "@/components/icons";
import { clsx } from "@/utils/clsx";

/**
 * @description SearchBar component
 * @param {string} input - Initial input value: 검색창의 초기값을 설정
 * @param {string} placeholder - 검색창의 placeholder를 설정
 */
interface SearchBarProps {
  input?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = memo(
  ({ input = "", placeholder = "Enter a search term...", onValueChange }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
      <div className="relative flex w-full max-w-xl gap-4">
        <Input
          ref={inputRef}
          value={input}
          onValueChange={onValueChange}
          placeholder={placeholder}
          radius="lg"
          size="lg"
          errorMessage="Please enter a valid search term"
          startContent={
            <SearchIcon
              size={16}
              className={clsx(["mb-0.5 flex-shrink-0", "text-primary"])}
            />
          }
          classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-lg max-sm:shadow-md",
              "bg-default-200/20",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focus=true]:bg-default-200/20",
              "dark:group-data-[focus=true]:bg-default/60",
              "!cursor-text",
            ],
            helperWrapper: [
              "flex relative flex-col invisible",
              "p-1 gap-1.5",
              "min-h-6",
              "group-data-[has-helper=true]:visible",
            ],
          }}
          isClearable
        />
      </div>
    );
  },
);

SearchBar.displayName = "[GuessWhat]SearchBar";

export default SearchBar;
