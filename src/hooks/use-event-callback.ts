import { useCallback, useRef } from "react";
import { useSafeLayoutEffect } from "./use-safe-layout-effect";

/**
 * Custom hook that creates a memoized event callback.
 * @template Args - An array of argument types for the event callback.
 * @template R - The return type of the event callback.
 * @param {(...args: Args) => R} fn - The callback function.
 * @returns {(...args: Args) => R} A memoized event callback function.
 * @public
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-event-callback)
 * @see {@link https://github.com/juliencrn/usehooks-ts/blob/master/packages/usehooks-ts/src/useEventCallback/useEventCallback.ts | source}
 * @example
 * ```tsx
 * const handleClick = useEventCallback((event) => {
 *   // Handle the event here
 * });
 * ```
 */
export function useEventCallback<Args extends unknown[], R>(
  fn: (...args: Args) => R,
): (...args: Args) => R;
export function useEventCallback<Args extends unknown[], R>(
  fn: ((...args: Args) => R) | undefined,
): ((...args: Args) => R) | undefined;
export function useEventCallback<Args extends unknown[], R>(
  fn: ((...args: Args) => R) | undefined,
): ((...args: Args) => R) | undefined {
  const ref = useRef<typeof fn>(() => {
    throw new Error("Cannot call an event handler while rendering.");
  });

  useSafeLayoutEffect(() => {
    ref.current = fn;
  }, [fn]);

  return useCallback((...args: Args) => ref.current?.(...args), [ref]) as (
    ...args: Args
  ) => R;
}
