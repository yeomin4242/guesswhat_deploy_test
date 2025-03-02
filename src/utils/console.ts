/* eslint-disable @typescript-eslint/no-explicit-any */
const warningStack: { [key: string]: boolean } = {};

/**
 * Custom warning function implementing a warning stack to prevent duplicate warnings
 * @param message {string} - Warning message
 * @param component {string} - Component name
 * @param args {any[]} - Additional arguments
 * @returns {void}
 * @see {@link https://github.com/nextui-org/nextui/blob/canary/packages/utilities/shared-utils/src/console.ts | source}
 */
export function warn(message: string, component?: string, ...args: any[]) {
  const tag = component ? ` [${component}]` : " ";
  const log = `[GuessWhat]${tag}: ${message}`;

  if (typeof console === "undefined") return;
  if (warningStack[log]) return;
  warningStack[log] = true;

  if (process?.env?.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    return console.warn(log, args);
  }
}
