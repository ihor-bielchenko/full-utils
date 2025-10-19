/**
 * Checks whether a given value is a **string** primitive.
 *
 * @summary
 * A strict type guard that returns `true` only if the provided value
 * has the JavaScript type `"string"`.  
 * Rejects all non-string types, including `String` objects created via `new String()`.
 *
 * @param value - Any value to test.
 *
 * @returns `true` if the value is a string primitive, otherwise `false`.
 *
 * @remarks
 * ### Behavior
 * - Uses the `typeof` operator for a strict type check.
 * - Does **not** coerce values — `"123"` is valid, but `123` is not.
 * - Returns `false` for:
 *   - `String` wrapper objects (`new String('abc')`)
 *   - Non-string types (`number`, `boolean`, `object`, `undefined`, etc.)
 *
 * ### Type narrowing
 * When this function returns `true`, TypeScript infers:
 * ```ts
 * value is string
 * ```
 * enabling full access to string methods safely.
 *
 * ### Comparison
 * | Input            | Result | Note                              |
 * |------------------|:------:|-----------------------------------|
 * | `'hello'`        | true  | String literal                     |
 * | `new String('x')`| false | Object wrapper, not primitive      |
 * | `123`            | false | Number                             |
 * | `null`           | false | Not a string                       |
 * | `undefined`      | false | Not a string                       |
 *
 * ### Performance
 * - Time complexity: **O(1)**  
 * - Space complexity: **O(1)**
 *
 * ### Examples
 *
 * @example
 * // Basic usage
 * isStr('Hello');       // => true
 * isStr('');            // => true
 * isStr(123);           // => false
 * isStr(null);          // => false
 *
 * @example
 * // Type narrowing
 * const val: unknown = 'abc';
 * if (isStr(val)) {
 *   console.log(val.toUpperCase()); // safe
 * }
 *
 * @category Type Guards
 * @public
 * @since 2.0.0
 */
export function isStr(value: unknown): value is string {
	return typeof value === 'string';
}
