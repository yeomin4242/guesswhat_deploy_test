import { useEffect, useState } from "react";

/**
 * A hook that returns whether the component is mounted or not.
 * @returns {boolean} Returns `true` if the component is mounted, else `false`.
 * @see {@link https://github.com/nextui-org/nextui/blob/canary/packages/hooks/use-is-mounted/src/index.ts | source}
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true);
    });
  }, []);

  return isMounted;
}
