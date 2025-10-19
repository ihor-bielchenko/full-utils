/**
 * Checks whether a value **exists** — i.e. is neither `null` nor `undefined`.
 *
 * @summary
 * A minimal and strongly typed utility that acts as a **type guard**
 * to filter out `null` and `undefined` values in TypeScript.  
 * It is especially useful in array filters and conditional checks
 * where you need to ensure a value is "present".
 *
 * @typeParam T - The original type of the tested value.
 *
 * @param value - Any value that may be `null` or `undefined`.
 *
 * @returns `true` if `value` is not `null` and not `undefined`, otherwise `false`.
 *
 * @remarks
 * ### Type narrowing
 * When this function returns `true`, TypeScript automatically infers:
 * ```ts
 * value is T
 * ```
 *  
 * That means inside the `if` block (or after using `Array.filter(isExists)`),
 * the compiler knows the value cannot be `null` or `undefined`.
 *
 * ### Behavior
 * - Returns `false` for `null` and `undefined`.
 * - Returns `true` for any other type — including `false`, `0`, `''`, `NaN`, empty arrays, etc.
 * - The check is **strict** (`!==`) — no type coercion occurs.
 *
 * ### Typical use cases
 * - Filtering arrays that may contain `null` or `undefined`.
 * - Guarding optional values before access.
 * - Simplifying type-safe checks in functional chains.
 *
 * ### Performance
 * - Time complexity: **O(1)**
 * - Space complexity: **O(1)**
 *
 * ### Examples
 *
 * @example
 * // Basic checks
 * isExists(null);        // => false
 * isExists(undefined);   // => false
 * isExists(0);           // => true
 * isExists('');          // => true
 * isExists(false);       // => true
 *
 * @example
 * // With TypeScript narrowing
 * const val: string | null | undefined = getValue();
 * if (isExists(val)) {
 *   // val is now guaranteed to be a string
 *   console.log(val.toUpperCase());
 * }
 *
 * @example
 * // Filtering nullable arrays
 * const arr = [1, null, 2, undefined, 3];
 * const clean = arr.filter(isExists);
 * // clean: number[]  => [1, 2, 3]
 *
 * @category Type Guards
 * @public
 * @since 2.0.0
 */
export function isExists<T>(value: T | null | undefined): value is T {
	return value !== null && value !== undefined;
}
