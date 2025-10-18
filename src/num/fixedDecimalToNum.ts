import type { FixedDecimal } from './types';
import { fixedDecimalToStr } from './fixedDecimalToStr';

/**
 * Converts a {@link FixedDecimal} — an exact decimal representation —
 * into a native JavaScript `number` (IEEE 754 double precision).
 *
 * @remarks
 * This function is a **lossy** conversion when `value` contains
 * more precision than JavaScript’s floating-point format can represent.
 * It internally calls {@link fixedDecimalToStr} to produce a normalized
 * string such as `"-123.4567"` and then passes it to the built-in
 * `Number()` constructor.
 *
 * @param value - The {@link FixedDecimal} instance to convert.
 * Must contain:
 * - `sign`: either `1` or `-1`;
 * - `digitsInteger`: a `bigint` representing all digits without any decimal point;
 * - `scale`: how many digits belong after the decimal point.
 *
 * @returns The approximate numeric value as a JavaScript `number`.
 * If the string form is too large or too precise, the result may be
 * rounded or become `Infinity`.
 *
 * @example
 * ```ts
 * const fd: FixedDecimal = { sign: 1, digitsInteger: 12345n, scale: 2 };
 * // Represents exactly 123.45
 * const num = fixedDecimalToNum(fd); // 123.45 (Number)
 * ```
 *
 * @example
 * ```ts
 * // Handles negative numbers as well
 * const neg: FixedDecimal = { sign: -1, digitsInteger: 987n, scale: 3 };
 * const n = fixedDecimalToNum(neg); // -0.987
 * ```
 *
 * @example
 * ```ts
 * // Extreme precision may lose digits beyond ~15–17 significant figures
 * const big: FixedDecimal = { sign: 1, digitsInteger: 12345678901234567890n, scale: 10 };
 * const approx = fixedDecimalToNum(big);
 * console.log(approx); // ~1234567890.1234567  (rounded)
 * ```
 *
 * @see fixedDecimalToStr — for the exact string representation
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number#precision JavaScript number precision
 *
 * @complexity
 * O(n) relative to the number of digits in `digitsInteger`
 * (due to string creation in {@link fixedDecimalToStr}).
 *
 * @since 2.0.0
 */
export function fixedDecimalToNum(value: FixedDecimal): number {
	return Number(fixedDecimalToStr(value));
}
