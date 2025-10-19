import { isStr } from '../index';

/**
 * Checks whether a given value is a **non-empty string** (not just whitespace).
 *
 * @summary
 * A strict type guard that returns `true` only if the value is a string
 * containing at least one non-whitespace character.  
 * This is an extended form of {@link isStr} that excludes empty (`""`) and
 * whitespace-only strings (`"   "`).
 *
 * @param value - Any value to test.
 *
 * @returns `true` if the value is a string with visible content, otherwise `false`.
 *
 * @remarks
 * ### Behavior
 * - Uses {@link isStr} to confirm the value is a string primitive.
 * - Calls `.trim()` to remove whitespace and checks if the resulting length is greater than zero.
 * - Returns `false` for:
 *   - Empty strings (`""`)
 *   - Whitespace-only strings (`"   "`, `"\n"`, `"\t"`)
 *   - Non-string values (`number`, `boolean`, `object`, `null`, etc.)
 *
 * ### Comparison
 * | Function        | Description                       | Example                   |
 * |-----------------|-----------------------------------|---------------------------|
 * | `isStr`         | Any string (including empty)      | `""` true                 |
 * | `isStrFilled`   | Non-empty trimmed string only     | `"  "` false / `"x"` true |
 *
 * ### Type narrowing
 * When this function returns `true`, TypeScript infers:
 * ```ts
 * value is string
 * ```
 * ensuring safe use of string operations.
 *
 * ### Performance
 * - Time complexity: **O(n)** (due to `.trim()`).
 * - Space complexity: **O(1)**.
 *
 * ### Examples
 *
 * @example
 * // Valid strings
 * isStrFilled('hello');     // => true
 * isStrFilled('  text  ');  // => true
 *
 * @example
 * // Empty or whitespace-only
 * isStrFilled('');          // => false
 * isStrFilled('   ');       // => false
 *
 * @example
 * // Non-string values
 * isStrFilled(null);        // => false
 * isStrFilled(123);         // => false
 * isStrFilled(undefined);   // => false
 *
 * @example
 * // Type narrowing
 * const val: unknown = '  value ';
 * if (isStrFilled(val)) {
 *   console.log(val.trim().toUpperCase()); // safe
 * }
 *
 * @see isStr
 * @see isArrFilled
 * @see isObjFilled
 *
 * @category Type Guards
 * @public
 * @since 2.0.0
 */
export function isStrFilled(value: unknown): value is string {
	return isStr(value) && value.trim().length > 0;
}
