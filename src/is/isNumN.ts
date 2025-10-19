import { isNum } from '../index';

/**
 * Checks whether a given value is a **negative finite number**.
 *
 * @summary
 * A strict type guard that returns `true` only if the input is a finite number
 * and its value is **less than 0**.  
 * Useful for safely detecting negative numeric values without coercion.
 *
 * @param value - Any value to test.
 *
 * @returns `true` if the value is a finite number less than zero, otherwise `false`.
 *
 * @remarks
 * ### Behavior
 * - Relies on {@link isNum} to ensure the value is a finite number (not `NaN`, `Infinity`, etc.).
 * - Then checks `value < 0`.
 * - Returns `false` for zero, positive numbers, and all non-numeric types.
 *
 * ### Comparison with related checks
 * | Function     | Description                            | Condition                   |
 * |--------------|----------------------------------------|-----------------------------|
 * | `isNum`      | Any finite number                      | `Number.isFinite(value)`    |
 * | `isNumP`     | Positive numbers only                  | `value > 0`                 |
 * | `isNumN`     | Negative numbers only                  | `value < 0`                 |
 * | `isNumNZ`    | Negative or zero numbers               | `value <= 0`                |
 * | `isNumFloat` | Finite non-integer (fractional) numbers | `!Number.isInteger(value)` |
 *
 * ### Performance
 * - Time complexity: **O(1)**  
 * - Space complexity: **O(1)**
 *
 * ### Examples
 *
 * @example
 * // Negative numbers
 * isNumN(-1);          // => true
 * isNumN(-3.14);       // => true
 * isNumN(-0.0001);     // => true
 *
 * @example
 * // Non-negative numbers
 * isNumN(0);           // => false
 * isNumN(1);           // => false
 * isNumN(42);          // => false
 *
 * @example
 * // Invalid values
 * isNumN(NaN);         // => false
 * isNumN('-5');        // => false
 * isNumN(null);        // => false
 * isNumN(undefined);   // => false
 *
 * @example
 * // Type narrowing
 * const val: unknown = -12;
 * if (isNumN(val)) {
 *   const abs = Math.abs(val); // val is number
 * }
 *
 * @see isNum
 * @see isNumP
 * @see isNumNZ
 * @see isNumFloat
 *
 * @category Type Guards
 * @public
 * @since 2.0.0
 */
export function isNumN(value: unknown): value is number {
	return isNum(value) && value < 0;
}
