import type { FixedDecimal } from '../index';

/**
 * Rounds a {@link FixedDecimal} value to the specified number of fractional digits,
 * using either **half-up** (standard rounding) or **truncation** (cut-off without rounding).
 *
 * @remarks
 * This function operates entirely in fixed-precision integer space (`BigInt` arithmetic),
 * so rounding is mathematically exact — it never suffers from floating-point errors.
 *
 * Internally, it determines how many fractional digits must be removed from
 * `source.digitsInteger` to reach the desired precision (`decimalPlaces`), divides
 * by `10 ** digitsToRemove`, and conditionally increments the result depending on
 * the remainder and rounding mode.
 *
 * It preserves the original `sign` and returns a new {@link FixedDecimal} object
 * with an updated `scale` (number of digits after the decimal point).
 *
 * ---
 * **Rounding modes:**
 * - `'half-up'` — standard rounding to nearest neighbor; `.5` rounds **away from zero**.
 *   Example: `1.235 → 1.24`, `-1.235 → -1.24`.
 * - `'trunc'` — truncates digits beyond the target precision (rounds **toward zero**).
 *   Example: `1.239 → 1.23`, `-1.239 → -1.23`.
 *
 * ---
 * @param source - The input {@link FixedDecimal} to round.
 * Must contain a valid combination of:
 * - `sign`: `1` or `-1`
 * - `digitsInteger`: a `BigInt` representing all digits (no decimal point)
 * - `scale`: number of digits after the decimal
 *
 * @param decimalPlaces - Target number of digits to keep **after the decimal point**.
 * Values less than 0 are treated as 0.  
 * For example, rounding to `2` means "keep two digits after the decimal".
 *
 * @param roundMode - Rounding algorithm to use:
 * - `'half-up'` (default) → rounds 0.5 and higher up.
 * - `'trunc'` → simply removes extra digits without rounding up.
 *
 * @defaultValue `'half-up'`
 *
 * @returns A **new** {@link FixedDecimal} with the adjusted `digitsInteger`
 * and `scale` equal to `decimalPlaces`.  
 * If the requested precision is greater than or equal to `source.scale`,
 * the source value is returned unchanged (shallow copy).
 *
 * @throws {Error}
 * - Never throws directly in normal use, but may propagate errors if invalid
 *   numeric parameters are passed (e.g., non-integer `decimalPlaces`).
 *
 * ---
 * @example
 * // Half-up rounding
 * const value: FixedDecimal = { sign: 1, digitsInteger: 123456n, scale: 3 }; // 123.456
 * roundFixedDecimal(value, 2, 'half-up');
 * // => { sign: 1, digitsInteger: 12346n, scale: 2 }  // 123.46
 *
 * @example
 * // Truncation (cut-off)
 * const value: FixedDecimal = { sign: 1, digitsInteger: 123456n, scale: 3 };
 * roundFixedDecimal(value, 2, 'trunc');
 * // => { sign: 1, digitsInteger: 12345n, scale: 2 }  // 123.45
 *
 * @example
 * // No rounding needed (scale already smaller)
 * const v: FixedDecimal = { sign: -1, digitsInteger: 1234n, scale: 1 }; // -123.4
 * roundFixedDecimal(v, 3);
 * // => identical copy: { sign: -1, digitsInteger: 1234n, scale: 1 }
 *
 * @example
 * // Rounding very small values
 * const v: FixedDecimal = { sign: 1, digitsInteger: 123n, scale: 6 }; // 0.000123
 * roundFixedDecimal(v, 4);
 * // => { sign: 1, digitsInteger: 1n, scale: 4 }  // 0.0001
 *
 * @example
 * // Rounding negative numbers (half-up → away from zero)
 * const v: FixedDecimal = { sign: -1, digitsInteger: 125n, scale: 2 }; // -1.25
 * roundFixedDecimal(v, 1, 'half-up');
 * // => { sign: -1, digitsInteger: 13n, scale: 1 }  // -1.3
 *
 * @see FixedDecimal
 * @see parseToFixedDecimal
 * @see fixedDecimalToNum
 * @see fixedDecimalToStr
 * @see formatToNum
 *
 * @category Math
 * @since 2.0.0
 * @public
 */
export function roundFixedDecimal(
	source: FixedDecimal,
	decimalPlaces: number,
	roundMode: 'half-up' | 'trunc' = 'half-up'
): FixedDecimal {
	const targetPrecision = Math.max(0, Math.trunc(decimalPlaces));

	if (source.scale <= targetPrecision) {
		return { ...source };
	}
	const digitsToRemove = source.scale - targetPrecision;
	const divisionFactor = 10n ** BigInt(digitsToRemove);
	const integerPart = source.digitsInteger / divisionFactor;
	const remainder = source.digitsInteger % divisionFactor;

	if (roundMode === 'trunc' || remainder === 0n) {
		return { 
			sign: source.sign, 
			digitsInteger: integerPart, 
			scale: targetPrecision, 
		};
	}
	const halfThreshold = divisionFactor / 2n;
	const shouldRoundUp = remainder >= halfThreshold;
	const roundedValue = shouldRoundUp ? integerPart + 1n : integerPart;
	
	return { 
		sign: source.sign, 
		digitsInteger: roundedValue, 
		scale: targetPrecision, 
	};
}