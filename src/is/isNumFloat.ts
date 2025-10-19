import { isNum } from '../index';

/**
 * Checks whether a given value is a **finite non-integer (floating-point) number**.
 *
 * @summary
 * Returns `true` if the value is a finite number and **has a fractional part**
 * (i.e. not an integer).  
 * Acts as a strict type guard for float-like numeric values.
 *
 * @param value - Any value to test.
 *
 * @returns `true` if the value is a finite, non-integer number; otherwise `false`.
 *
 * @remarks
 * ### Behavior
 * - First verifies that the value is a finite number via {@link isNum}.
 * - Then ensures it is **not** an integer using `!Number.isInteger(value)`.
 * - Rejects all non-numeric, `NaN`, or infinite values.
 *
 * ### Comparison with related checks
 * | Function       | Matches                        | Rejects                            |
 * |----------------|--------------------------------|------------------------------------|
 * | `isNum`        | any finite number              | `NaN`, `Infinity`, `-Infinity`     |
 * | `isNumFloat`   | finite numbers **with fraction** | integers, `NaN`, non-numbers     |
 * | `isNumInt`     | finite **integers** only       | floats, `NaN`, non-numbers         |
 *
 * ### Performance
 * - Time complexity: **O(1)**  
 * - Space complexity: **O(1)**
 *
 * ### Examples
 *
 * @example
 * // Valid floats
 * isNumFloat(3.14);       // => true
 * isNumFloat(-0.001);     // => true
 * isNumFloat(1 / 3);      // => true
 *
 * @example
 * // Integers
 * isNumFloat(0);          // => false
 * isNumFloat(42);         // => false
 * isNumFloat(-7);         // => false
 *
 * @example
 * // Invalid or non-number values
 * isNumFloat(NaN);        // => false
 * isNumFloat(Infinity);   // => false
 * isNumFloat('3.14');     // => false
 * isNumFloat(null);       // => false
 *
 * @example
 * // Type narrowing
 * const val: unknown = 12.5;
 * if (isNumFloat(val)) {
 *   const n = val * 2; // val is number
 * }
 *
 * @see isNum
 * @see Number.isInteger
 *
 * @category Type Guards
 * @public
 * @since 2.0.0
 */
export function isNumFloat(value: unknown): value is number {
	return isNum(value) && !Number.isInteger(value);
}
