/**
 * Checks whether a given value is a **finite number**.
 *
 * @summary
 * A strict type guard that returns `true` only if `value` is of type `"number"`
 * and is a finite numeric value (not `NaN`, `Infinity`, or `-Infinity`).
 *
 * @param value - Any value to check.
 *
 * @returns `true` if the value is a finite number, otherwise `false`.
 *
 * @remarks
 * ### Behavior
 * - Uses the built-in `typeof` operator to ensure the value is a primitive number.
 * - Rejects special non-finite numeric values:
 *   - `NaN`
 *   - `Infinity`
 *   - `-Infinity`
 * - Does **not** coerce strings — `"123"` returns `false`.
 * - Works only with **number primitives**, not `Number` objects (`new Number(5)` returns `false`).
 *
 * ### Type narrowing
 * When this function returns `true`, TypeScript automatically infers:
 * ```ts
 * value is number
 * ```
 * allowing you to use numeric operators and arithmetic safely.
 *
 * ### Comparison with related checks
 * | Function       | Accepts                         | Rejects                        |
 * |----------------|---------------------------------|--------------------------------|
 * | `isNum`        | finite numbers only             | `NaN`, `Infinity`, non-numbers |
 * | `isNumP`       | positive finite numbers         | `0`, negatives, `NaN`          |
 * | `isNumNZ`      | zero or negative finite numbers | positives, `NaN`               |
 *
 * ### Performance
 * - Time complexity: **O(1)**
 * - Space complexity: **O(1)**
 *
 * ### Examples
 *
 * @example
 * // Valid finite numbers
 * isNum(42);           // => true
 * isNum(0);            // => true
 * isNum(-3.14);        // => true
 *
 * @example
 * // Invalid numeric values
 * isNum(NaN);          // => false
 * isNum(Infinity);     // => false
 * isNum(-Infinity);    // => false
 *
 * @example
 * // Non-number inputs
 * isNum('123');        // => false
 * isNum(true);         // => false
 * isNum(null);         // => false
 * isNum(undefined);    // => false
 *
 * @example
 * // TypeScript narrowing
 * const x: unknown = 100;
 * if (isNum(x)) {
 *   console.log(x.toFixed(2)); // OK — x is number
 * }
 *
 * @category Type Guards
 * @public
 * @since 2.0.0
 */
export function isNum(value: unknown): value is number {
	return (typeof value === 'number') && Number.isFinite(value);
}
