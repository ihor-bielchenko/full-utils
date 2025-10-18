import { isNum } from './isNum';

/**
 * Checks whether a given value is a **finite number greater than or equal to zero**.
 *
 * @summary
 * A strict type guard that returns `true` if the input is a finite number
 * and its value is **non-negative** (`≥ 0`).  
 * Useful for safely validating values such as counters, sizes, durations,
 * and other quantities that cannot be negative.
 *
 * @param value - Any value to test.
 *
 * @returns `true` if the value is a finite number greater than or equal to zero; otherwise `false`.
 *
 * @remarks
 * ### Behavior
 * - Uses {@link isNum} to ensure the input is a finite number (`NaN`, `Infinity`, `-Infinity` are rejected).
 * - Returns `true` when `value >= 0`.
 * - Returns `false` for negative numbers or non-numeric inputs.
 *
 * ### Comparison with related checks
 * | Function     | Description                      | Condition                  |
 * |--------------|----------------------------------|----------------------------|
 * | `isNum`      | Any finite number                | —                          |
 * | `isNumP`     | Positive numbers only            | `value > 0`                |
 * | `isNumPZ`    | Non-negative numbers (`≥ 0`)     | `value >= 0`               |
 * | `isNumN`     | Negative numbers only            | `value < 0`                |
 * | `isNumNZ`    | Negative or zero numbers         | `value <= 0`               |
 * | `isNumFloat` | Finite non-integer numbers       | `!Number.isInteger(value)` |
 *
 * ### Performance
 * - Time complexity: **O(1)**  
 * - Space complexity: **O(1)**
 *
 * ### Examples
 *
 * @example
 * // Non-negative numbers
 * isNumPZ(0);           // => true
 * isNumPZ(5);           // => true
 * isNumPZ(3.14);        // => true
 *
 * @example
 * // Negative numbers
 * isNumPZ(-1);          // => false
 * isNumPZ(-0.1);        // => false
 *
 * @example
 * // Invalid or non-numeric inputs
 * isNumPZ('10');        // => false
 * isNumPZ(NaN);         // => false
 * isNumPZ(Infinity);    // => false
 * isNumPZ(null);        // => false
 *
 * @example
 * // Type narrowing
 * const val: unknown = 7;
 * if (isNumPZ(val)) {
 *   console.log(Math.sqrt(val)); // val is number
 * }
 *
 * @see isNum
 * @see isNumP
 * @see isNumN
 * @see isNumNZ
 * @see isNumFloat
 *
 * @category Type Guards
 * @public
 * @since 1.0.0
 */
export function isNumPZ(value: unknown): value is number {
	return isNum(value) && value >= 0;
}
