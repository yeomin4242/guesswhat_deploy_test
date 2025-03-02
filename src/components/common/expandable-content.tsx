"use client";

import { ChevronsDownIcon, ChevronsUpIcon } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { tv } from "tailwind-variants";

interface Props {
  children: ReactNode;
  className?: string;
  onToggle?: () => void;
}

const content = tv({
  base: "flex flex-wrap gap-3",
  variants: {
    isExpanded: {
      true: "h-max",
      false: "max-h-[80px] overflow-hidden",
    },
  },
});

const icon = tv({
  base: "h-[16px] text-gray-500 hover:text-gray-800",
});

const ExpandableContent = ({ children, className, onToggle }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [expandable, setExpandable] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
    if (onToggle) onToggle();
  };

  useEffect(() => {
    if (ref.current && ref.current.scrollHeight > 80) {
      setExpandable(true);
    }
  }, [ref]);

  return (
    <>
      <div ref={ref} className={content({ isExpanded, class: className })}>
        {children}
      </div>
      <div className="flex w-full justify-center">
        {expandable && (
          <button
            className="flex w-full justify-center rounded-md border-default-800 py-[0.125rem] shadow-small"
            onClick={toggleExpand}
          >
            {isExpanded ? (
              <ChevronsUpIcon className={icon()} />
            ) : (
              <ChevronsDownIcon className={icon()} />
            )}
          </button>
        )}
      </div>
    </>
  );
};

export default ExpandableContent;
