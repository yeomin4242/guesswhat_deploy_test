import { useCallback, useReducer, useRef } from "react";
import useDebouncedCallback, {
  DebouncedState,
} from "@/hooks/use-debounce/use-debounced-callback";

function valueEquality<T>(left: T, right: T): boolean {
  return left === right;
}

function reducer<T>(_: T, action: T) {
  return action;
}

/**
 * A hook that returns a debounced version of the value.
 * @param value Value to be debounced
 * @param delay Debounce delay in milliseconds
 * @param options Options for the debounced callback
 * @returns {Array} An array containing the debounced value and the debounced state
 * @see {@link https://github.com/xnimorz/use-debounce/blob/master/src/useDebounce.ts | source}
 *
 */
export default function useDebounce<T>(
  value: T,
  delay: number,
  options?: {
    maxWait?: number;
    leading?: boolean;
    trailing?: boolean;
    equalityFn?: (left: T, right: T) => boolean;
  },
): [T, DebouncedState<(value: T) => void>] {
  const eq = (options && options.equalityFn) || valueEquality;

  const [state, dispatch] = useReducer(reducer, value);
  const debounced = useDebouncedCallback(
    useCallback((value: T) => dispatch(value), [dispatch]),
    delay,
    options,
  );
  const previousValue = useRef(value);

  // eslint-disable-next-line rulesdir/pure-render
  if (!eq(previousValue.current, value)) {
    debounced(value);
    // eslint-disable-next-line rulesdir/pure-render
    previousValue.current = value;
  }

  if (eq(state as T, value)) {
    debounced.cancel();
  }

  return [state as T, debounced];
}
