/* eslint-disable */
export type Dict<T = any> = Record<string, T>;

/**
 * Validate if the value is an array.
 * @param value The value to validate.
 * @returns Whether the value is an array.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray}
 */
export function isArray<T>(value: any): value is Array<T> {
  return Array.isArray(value);
}

/**
 * Validate if the value is an empty array.
 * @param value The value to validate.
 * @returns Whether the value is an empty array.
 * @see {@link https://github.com/nextui-org/nextui/blob/canary/packages/utilities/shared-utils/src/assertion.ts}
 */
export function isEmptyArray(value: any) {
  return isArray(value) && value.length === 0;
}

/**
 * Validate if the value is an object.
 * @param value The value to validate.
 * @returns Whether the value is an object.
 * @see {@link https://github.com/GoogleCloudPlatform/iap-gcip-web-toolkit/blob/master/authui-container/common/validator.ts}
 */
export function isObject(value: any): value is Dict {
  const type = typeof value;

  return (
    value != null &&
    (type === "object" || type === "function") &&
    !isArray(value)
  );
}

/**
 * Validate if the value is an empty object.
 * @param value The value to validate.
 * @returns Whether the value is an empty object.
 * @see {@link https://github.com/nextui-org/nextui/blob/canary/packages/utilities/shared-utils/src/assertion.ts}
 */
export function isEmptyObject(value: any) {
  return isObject(value) && Object.keys(value).length === 0;
}

/**
 * Validate if the value is empty, including empty arrays and objects.
 * @param value The value to validate.
 * @returns Whether the value is empty.
 * @see {@link https://github.com/nextui-org/nextui/blob/canary/packages/utilities/shared-utils/src/assertion.ts}
 */
export function isEmpty(value: any): boolean {
  if (isArray(value)) return isEmptyArray(value);
  if (isObject(value)) return isEmptyObject(value);
  if (value == null || value === "") return true;

  return false;
}

/**
 * Validate if the value is a function.
 * @param value The value to validate.
 * @returns Whether the value is a function.
 * @see {@link https://github.com/nextui-org/nextui/blob/canary/packages/utilities/shared-utils/src/assertion.ts}
 */
export function isFunction<T extends Function = Function>(
  value: any,
): value is T {
  return typeof value === "function";
}

type Booleanish = boolean | "true" | "false";

/**
 * Validate if the condition is true and return a booleanish value.
 * @param condition The condition to validate.
 * @returns A booleanish value.
 * @see {@link https://github.com/nextui-org/nextui/blob/canary/packages/utilities/shared-utils/src/assertion.ts}
 */
export const dataAttr = (condition: boolean | undefined) =>
  (condition ? "true" : undefined) as Booleanish;

/**
 * Validate if the value is a number.
 * @param value The value to validate.
 * @returns Whether the value is a number.
 */
export const isNumeric = (value?: string | number) =>
  value != null && parseInt(value.toString(), 10) > 0;

/**
 * Validates that a value is a string.
 *
 * @param value The value to validate.
 * @return Whether the value is a string or not.
 */
export function isString(value: any): value is string {
  return typeof value === "string";
}
