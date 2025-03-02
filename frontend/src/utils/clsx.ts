import { isArray, isString } from "@/utils/assertion";

/**
 * A utility function to extract a string from mixed arguments.
 * @param mix Mixed arguments of strings, objects, or arrays.
 * @returns A string extracted from the mixed arguments.
 * @see {@link https://github.com/lukeed/clsx}
 */
function toVal(mix: any) {
  let k,
    y,
    str = "";

  if (isString(mix) || typeof mix === "number") {
    str += mix;
  } else if (typeof mix === "object") {
    if (isArray(mix)) {
      for (k = 0; k < mix.length; k++) {
        if (mix[k]) {
          if ((y = toVal(mix[k]))) {
            str && (str += " ");
            str += y;
          }
        }
      }
    } else {
      for (k in mix) {
        if (mix[k]) {
          str && (str += " ");
          str += k;
        }
      }
    }
  }

  return str;
}

/**
 * A utility function to concatenate class names together.
 * @param args An array of strings, objects, or arrays to be concatenated together.
 * @returns A string of concatenated class names.
 * @see {@link https://github.com/lukeed/clsx}
 */
export function clsx(...args: any[]) {
  let i = 0,
    tmp,
    x,
    str = "";

  while (i < args.length) {
    if ((tmp = args[i++])) {
      if ((x = toVal(tmp))) {
        str && (str += " ");
        str += x;
      }
    }
  }

  return str;
}
