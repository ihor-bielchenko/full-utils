import type { FixedDecimal } from './types';
import { normalizeToDecimalComponents } from './normalizeToDecimalComponents';

/**
 * Parses any numeric input (`number`, `bigint`, or `string`) into an exact {@link FixedDecimal}
 * representation, preserving all digits without floating-point rounding errors.
 *
 * @remarks
 * This function transforms arbitrary numeric input into a **fixed-precision decimal structure**
 * that can safely represent extremely large or small values without losing information.
 * It achieves this by first decomposing the input using {@link normalizeToDecimalComponents}
 * and then constructing a `FixedDecimal` object consisting of:
 *
 * - `sign` → `1` for positive values, `-1` for negative values.
 * - `digitsInteger` → a `BigInt` that encodes *all digits* of the number as if
 *   the decimal point were removed.
 * - `scale` → the count of digits that were originally after the decimal point.
 *
 * The resulting value can later be precisely converted back to a string or to a
 * JavaScript `number` using helpers like `fixedDecimalToStr` or `fixedDecimalToNum`.
 *
 * This process **avoids IEEE-754 floating-point artifacts**, ensuring mathematically
 * exact handling of decimal fractions (e.g. `"0.1" + "0.2" → 0.3` instead of `0.30000000000000004`).
 *
 * @param input - Any numeric source value. Supported types:
 * - `number` — finite only (`NaN`, `Infinity`, `-Infinity` will throw).
 * - `bigint` — directly converted without fractional digits.
 * - `string` — may contain optional sign, decimal point, or exponential notation (`1.23e-5`).
 *   Commas `,` as decimal separators are also supported and converted to dots `.`.
 *
 * @returns A normalized {@link FixedDecimal} object:
 * ```ts
 * {
 *   sign: 1 | -1;           // the numeric sign
 *   digitsInteger: bigint;   // all digits as a BigInt, no decimal point
 *   scale: number;           // number of digits after the decimal
 * }
 * ```
 *
 * @throws {Error}
 * - If the input is not a supported type (`number`, `bigint`, or `string`).
 * - If the string cannot be parsed as a valid numeric representation.
 * - If the number is not finite.
 * - Any error propagated from {@link normalizeToDecimalComponents}.
 *
 * @example
 * // Simple integer number
 * parseToFixedDecimal(42);
 * // => { sign: 1, digitsInteger: 42n, scale: 0 }
 *
 * @example
 * // Decimal fraction
 * parseToFixedDecimal("123.456");
 * // => { sign: 1, digitsInteger: 123456n, scale: 3 }
 *
 * @example
 * // Number in exponential notation
 * parseToFixedDecimal("-1.23e-4");
 * // => { sign: -1, digitsInteger: 123n, scale: 6 } // represents -0.000123
 *
 * @example
 * // Leading zeros and trailing fractional zeros are trimmed internally
 * parseToFixedDecimal("00045.67000");
 * // => { sign: 1, digitsInteger: 4567n, scale: 2 } // "45.67"
 *
 * @example
 * // Very large integer input using bigint
 * parseToFixedDecimal(123456789012345678901234567890n);
 * // => { sign: 1, digitsInteger: 123456789012345678901234567890n, scale: 0 }
 *
 * @example
 * // Negative value with high precision fraction
 * parseToFixedDecimal("-0.00000003432");
 * // => { sign: -1, digitsInteger: 3432n, scale: 11 }
 *
 * @see normalizeToDecimalComponents
 * @see FixedDecimal
 * @see fixedDecimalToNum
 * @see fixedDecimalToStr
 *
 * @category Parsing
 * @since 2.0.0
 * @public
 */
export function parseToFixedDecimal(input: unknown): FixedDecimal {
	const { 
		sign, 
		integerPart, 
		fractionalPart, 
	} = normalizeToDecimalComponents(input);
	const integerDigits = integerPart.replace(/^0+/, '') || '0';
	const fractionalDigits = fractionalPart.replace(/0+$/, '');
	const combinedDigits = (integerDigits + fractionalDigits) || '0';

	return {
		sign,
		digitsInteger: BigInt(combinedDigits),
		scale: fractionalDigits.length,
	};
}
