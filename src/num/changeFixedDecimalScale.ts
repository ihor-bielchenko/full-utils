import type { FixedDecimal } from './types';

/**
 * Adjusts the **scale** (i.e., number of fractional digits) of a {@link FixedDecimal}
 * by a given offset without altering its numeric meaning.
 *
 * @remarks
 * A `FixedDecimal` represents a decimal number as:
 * ```ts
 * { sign: 1 | -1, digitsInteger: bigint, scale: number }
 * ```
 * where `digitsInteger × 10^(-scale)` yields the real value.
 *
 * This helper changes the `scale` while keeping the numerical value consistent.
 * When `scaleDelta > 0`, the function *increases* the scale (adds more fractional
 * digits of precision) **without changing** `digitsInteger`.  
 * When `scaleDelta < 0`, it *reduces* the scale by multiplying `digitsInteger`
 * to preserve the same actual numeric value.
 * 
 * O(1) time and space, except for the BigInt multiplication when `scaleDelta < 0`.
 *
 * @param value - The {@link FixedDecimal} to adjust.  
 * Should contain:
 * - `sign`: either `1` (positive) or `-1` (negative),
 * - `digitsInteger`: the integer form of all digits without a decimal point,
 * - `scale`: the number of fractional digits currently represented.
 *
 * @param scaleDelta - The number of fractional places to add or remove.
 * Positive values mean **increase precision** (more digits after the decimal point);
 * negative values mean **reduce precision**, scaling the integer part accordingly.
 *
 * @returns A new {@link FixedDecimal} with the adjusted `scale` and appropriately
 * modified `digitsInteger` if needed.
 *
 * @throws {RangeError} If the operation would cause an invalid scale
 * (e.g., non-integer `scaleDelta`), though `Math.trunc` is used to normalize inputs.
 *
 * @example
 * ```ts
 * const num: FixedDecimal = { sign: 1, digitsInteger: 12345n, scale: 2 };
 * // Represents 123.45
 *
 * // Increase scale by +2 → same numeric value but more fractional digits
 * const up = changeFixedDecimalScale(num, +2);
 * // up = { sign: 1, digitsInteger: 12345n, scale: 4 } → 1.2345 × 10^2 = 123.45
 *
 * // Decrease scale by -2 → multiply digitsInteger to preserve value
 * const down = changeFixedDecimalScale(num, -2);
 * // down = { sign: 1, digitsInteger: 1234500n, scale: 0 } → 1234500 × 10^0 = 123.45
 * ```
 *
 * @example
 * ```ts
 * // No change when delta = 0
 * const same = changeFixedDecimalScale(num, 0);
 * // same === { sign: 1, digitsInteger: 12345n, scale: 2 }
 * ```
 * 
 * @since 2.0.0
 */
export function changeFixedDecimalScale(value: FixedDecimal, scaleDelta: number): FixedDecimal {
	const delta = Math.trunc(scaleDelta);

	if (delta === 0) {
		return { ...value };
	}
	if (delta > 0) {
		return {
			sign: value.sign,
			digitsInteger: value.digitsInteger,
			scale: value.scale + delta,
		};
	}
	const multiplier = 10n ** BigInt(-delta);
	
	return {
		sign: value.sign,
		digitsInteger: value.digitsInteger * multiplier,
		scale: value.scale + delta,
	};
}
