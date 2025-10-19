import type { FixedDecimal } from '../index';

/**
 * Converts a {@link FixedDecimal} — an exact, integer-based decimal structure —
 * into its canonical string representation (e.g. `"-123.456"`).
 *
 * @remarks
 * This function is **exact and reversible**: no precision loss occurs because it
 * operates on the raw digit string (`digitsInteger`) and inserts the decimal point
 * purely by string manipulation.
 *
 * The algorithm:
 * 1. Converts the `digitsInteger` `BigInt` to a string of digits.
 * 2. If `scale` is `0`, returns the signed integer directly.
 * 3. If `scale` is positive:
 *    - Pads with leading zeros when the number of digits is smaller than `scale`.
 *    - Otherwise, splits at the appropriate boundary between integer and fractional parts.
 * 
 * O(n) where `n` is the number of digits in `digitsInteger.toString()`.
 *
 * @param value - The {@link FixedDecimal} object:
 *   - `sign`: `1` for positive or `-1` for negative numbers.
 *   - `digitsInteger`: All digits as a `BigInt` without a decimal point.
 *   - `scale`: The number of digits after the decimal point.
 *
 * @returns A string representation of the number, including a `-` sign if negative.
 * If the number is fractional, a single `.` separates integer and fractional parts.
 *
 * @example
 * ```ts
 * const fd: FixedDecimal = { sign: 1, digitsInteger: 12345n, scale: 2 };
 * fixedDecimalToStr(fd); // "123.45"
 * ```
 *
 * @example
 * ```ts
 * // Negative number
 * const neg: FixedDecimal = { sign: -1, digitsInteger: 987n, scale: 3 };
 * fixedDecimalToStr(neg); // "-0.987"
 * ```
 *
 * @example
 * ```ts
 * // Small fractional with fewer digits than scale
 * const tiny: FixedDecimal = { sign: 1, digitsInteger: 12n, scale: 5 };
 * fixedDecimalToStr(tiny); // "0.00012"
 * ```
 *
 * @example
 * ```ts
 * // Whole number (scale = 0)
 * const whole: FixedDecimal = { sign: 1, digitsInteger: 42n, scale: 0 };
 * fixedDecimalToStr(whole); // "42"
 * ```
 *
 * @see changeFixedDecimalScale — for adjusting the scale value safely
 * @see fixedDecimalToNum — for converting to a JavaScript number
 *
 * @since 2.0.0
 */
export function fixedDecimalToStr(value: FixedDecimal): string {
	const signSymbol = value.sign < 0 ? '-' : '';
	const allDigitsString = value.digitsInteger.toString();

	if (value.scale === 0) {
		return signSymbol + allDigitsString;
	}
	const padZeros = value.scale - allDigitsString.length;

	if (padZeros >= 0) {
		return signSymbol + '0.' + '0'.repeat(padZeros) + allDigitsString;
	}
	const integerBoundary = allDigitsString.length - value.scale;
	const integerText = allDigitsString.slice(0, integerBoundary);
	const fractionalText = allDigitsString.slice(integerBoundary);

	return signSymbol + integerText + '.' + fractionalText;
}
