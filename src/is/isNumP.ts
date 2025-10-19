import { isNum } from '../index';

/**
 * Checks whether a given value is a **positive finite number**.
 *
 * @summary
 * A strict type guard that returns `true` only if the input is a finite number
 * greater than zero (`> 0`).  
 * Useful for safely validating numeric values that must be positive — such as
 * counters, IDs, amounts, or dimensions.
 *
 * @param value - Any value to test.
 *
 * @returns `true` if the value is a finite positive number, otherwise `false`.
 *
 * @remarks
 * ### Behavior
 * - Uses {@link isNum} to ensure the input is a finite number (`NaN`, `Infinity`, and `-Infinity` are rejected).
 * - Returns `true` only when `value > 0`.
 * - Returns `false` for zero, negative, or non-numeric values.
 *
 * ### Comparison with related checks
 * | Function     | Description                       | Condition                  |
 * |--------------|-----------------------------------|----------------------------|
 * | `isNum`      | Any finite number                 | —                          |
 * | `isNumP`     | Positive numbers only             | `value > 0`                |
 * | `isNumN`     | Negative numbers only             | `value < 0`                |
 * | `isNumNZ`    | Negative **or zero** numbers      | `value <= 0`               |
 * | `isNumFloat` | Finite non-integer (fractional)   | `!Number.isInteger(value)` |
 *
 * ### Performance
 * - Time complexity: **O(1)**  
 * - Space complexity: **O(1)**
 *
 * ### Examples
 *
 * @example
 * // Positive values
 * isNumP(1);           // => true
 * isNumP(3.14);        // => true
 * isNumP(0.00001);     // => true
 *
 * @example
 * // Zero and negatives
 * isNumP(0);           // => false
 * isNumP(-1);          // => false
 * isNumP(-0.5);        // => false
 *
 * @example
 * // Invalid or non-numeric inputs
 * isNumP('5');         // => false
 * isNumP(NaN);         // => false
 * isNumP(Infinity);    // => false
 * isNumP(null);        // => false
 *
 * @example
 * // Type narrowing
 * const x: unknown = 12;
 * if (isNumP(x)) {
 *   console.log(x.toFixed(1)); // x is number
 * }
 *
 * @see isNum
 * @see isNumN
 * @see isNumNZ
 * @see isNumFloat
 *
 * @category Type Guards
 * @public
 * @since 2.0.0
 */
export function isNumP(value: unknown): value is number {
	return isNum(value) && value > 0;
}
