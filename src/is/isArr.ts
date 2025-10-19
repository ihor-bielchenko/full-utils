/**
 * Checks whether a given value is an array.
 *
 * @summary
 * A strongly typed wrapper around {@link Array.isArray}, with an enhanced TypeScript
 * type guard that asserts the value as a **readonly non-empty array** (`readonly [T, ...T[]]`).
 *
 * @typeParam T - The expected element type of the array (defaults to `unknown`).
 *
 * @param value - Any value to test.
 *
 * @returns `true` if the value is an array (of any kind), otherwise `false`.
 * The return type acts as a **type guard**, allowing TypeScript to infer that
 * `value` is a readonly array of `T` when the function returns `true`.
 *
 * @remarks
 * - Internally uses the native {@link Array.isArray} method.
 * - Works correctly across realms (e.g., iframes, worker contexts, etc.).
 * - The type guard ensures `value` is a **readonly non-empty array**, not just an empty list.
 *   This provides safer downstream access patterns when empty arrays are not expected.
 * - If you need to allow empty arrays, consider changing the type to `readonly T[]`.
 *
 * ### Performance
 * - Time complexity: **O(1)** — constant time native check.
 * - Space complexity: **O(1)**.
 *
 * ### Common pitfalls
 * - `isArr([])` → `true`, even though the static type is `readonly [T, ...T[]]`.
 *   TypeScript does not validate runtime emptiness; you should still check `value.length`.
 * - `isArr('abc')` → `false`
 * - `isArr({ length: 3 })` → `false`
 *
 * ### Examples
 *
 * @example
 * // Basic usage
 * isArr([1, 2, 3]); // => true
 * isArr('hello');    // => false
 * isArr({});         // => false
 *
 * @example
 * // With type inference
 * const val: unknown = [10, 20];
 * if (isArr<number>(val)) {
 *   // TypeScript now knows val: readonly [number, ...number[]]
 *   console.log(val[0]); // OK
 * }
 *
 * @example
 * // With mixed content
 * isArr([true, 'text', 123]); // => true
 *
 * @see Array.isArray
 *
 * @category Type Guards
 * @public
 * @since 2.0.0
 */
export function isArr<T = unknown>(value: unknown): value is readonly [T, ...T[]] {
	return Array.isArray(value);
}
