import { isNum } from './isNum';

/**
 * Checks whether a given value is a **finite number that is less than or equal to zero**.
 *
 * @summary
 * A strict type guard that returns `true` if the input is a finite number and
 * its value is **negative or zero**.  
 * Commonly used to identify non-positive numeric values.
 *
 * @param value - Any value to test.
 *
 * @returns `true` if the value is a finite number less than or equal to zero; otherwise `false`.
 *
 * @remarks
 * ### Behavior
 * - Uses {@link isNum} to ensure the input is a finite number (rejects `NaN`, `Infinity`, etc.).
 * - Then checks the condition `value <= 0`.
 * - Returns `false` for all positive numbers and non-numeric values.
 *
 * ### Comparison with related checks
 * | Function     | Description                       | Condition      |
 * |--------------|-----------------------------------|----------------|
 * | `isNum`      | Any finite number                 | —              |
 * | `isNumP`     | Positive numbers only             | `value > 0`    |
 * | `isNumN`     | Negative numbers only             | `value < 0`    |
 * | `isNumNZ`    | Negative **or zero** numbers      | `value <= 0`   |
 * | `isNumFloat` | Finite non-integer (fractional)   | `!Number.isInteger(value)` |
 *
 * ### Performance
 * - Time complexity: **O(1)**  
 * - Space complexity: **O(1)**
 *
 * ### Examples
 *
 * @example
 * // Negative and zero values
 * isNumNZ(-1);          // => true
 * isNumNZ(-0.5);        // => true
 * isNumNZ(0);           // => true
 *
 * @example
 * // Positive values
 * isNumNZ(0.0001);      // => false
 * isNumNZ(5);           // => false
 *
 * @example
 * // Invalid or non-numeric inputs
 * isNumNZ('0');         // => false
 * isNumNZ(NaN);         // => false
 * isNumNZ(Infinity);    // => false
 * isNumNZ(null);        // => false
 *
 * @example
 * // Type narrowing
 * const x: unknown = -10;
 * if (isNumNZ(x)) {
 *   console.log(x.toFixed(2)); // x is number
 * }
 *
 * @see isNum
 * @see isNumP
 * @see isNumN
 * @see isNumFloat
 *
 * @category Type Guards
 * @public
 * @since 1.0.0
 */
export function isNumNZ(value: unknown): value is number {
	return isNum(value) && value <= 0;
}
