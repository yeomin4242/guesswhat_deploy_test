/* eslint-disable rulesdir/useLayoutEffectRule */
import { useEffect, useLayoutEffect } from "react";

/**
 * A hook that returns the correct layout effect based on the environment.
 * @returns {Function} Returns `useLayoutEffect` if the environment supports it, else `useEffect`.
 * @see {@link https://github.com/nextui-org/nextui/blob/canary/packages/hooks/use-safe-layout-effect/src/index.ts | source}
 */
export const useSafeLayoutEffect = Boolean(globalThis?.document)
  ? useLayoutEffect
  : useEffect;
