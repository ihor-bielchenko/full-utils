import { isNumPZ } from '../index';

/**
 * Converts a number expressed in normalized exponential/scientific notation
 * (e.g., `"1.23e+5"`, `"4e-7"`, `"0009.500e2"`) into its **sign**, **integer**,
 * and **fractional** parts as plain decimal digit strings — **without** any
 * decimal point or leading `+`/`-` characters.
 *
 * @remarks
 * - This function does **not** perform numeric arithmetic; instead it does a
 *   textual normalization that preserves all significant digits exactly.
 * - It accepts the `sign` separately so that callers can pre-parse signs from
 *   inputs like `"-1.23e3"` and pass `sign = -1` with `exponentialString = "1.23e3"`.
 *   (If you already have a positive string, pass `sign = 1`.)
 * - The function normalizes the coefficient and exponent first, then uses a
 *   single regex match to validate the shape:
 *   - Coefficient: `([0-9]+)(?:\.([0-9]*))?`
 *   - Exponent: `e([+\-]?[0-9]+)`
 * - Trailing zeros are added to the **integer** side for positive net exponents,
 *   while leading zeros are added to the **fractional** side for negative net exponents.
 * - All returned parts (`integerPart`, `fractionalPart`) contain only ASCII digits.
 *   The decimal point is **not** returned; you can re-insert it if needed by
 *   placing it between `integerPart` and `fractionalPart`.
 * 
 * Time O(n) and space O(n), where n is the number of digits in the coefficient,
 * due to string concatenation and slicing.
 *
 * @param sign - The pre-parsed sign of the number: `1` for positive, `-1` for negative.
 * @param exponentialString - A string in exponential notation.
 *   Examples: `"1e3"`, `"1.23e+5"`, `"4.560e-2"`, `"0009.500e2"`.
 *   The function is case-insensitive for the `'e'` and tolerates leading zeros in the coefficient.
 *
 * @returns An object with three properties:
 * - `sign`: Echo of the input sign (`1` | `-1`).
 * - `integerPart`: All digits to the left of the decimal point after expansion.
 * - `fractionalPart`: All digits to the right of the decimal point after expansion.
 *
 * @throws {Error} If `exponentialString` cannot be parsed as scientific notation.
 *
 * @example
 * ```ts
 * // 1.23 × 10^5 = 123000
 * convertExponentialToParts(1, "1.23e5");
 * // => { sign: 1, integerPart: "123000", fractionalPart: "" }
 * ```
 *
 * @example
 * ```ts
 * // 4.5 × 10^-3 = 0.0045
 * convertExponentialToParts(1, "4.5e-3");
 * // => { sign: 1, integerPart: "0", fractionalPart: "0045" }
 * ```
 *
 * @example
 * ```ts
 * // -7.00e+0 = -7
 * convertExponentialToParts(-1, "7.00e0");
 * // => { sign: -1, integerPart: "7", fractionalPart: "" }
 * ```
 *
 * @example
 * ```ts
 * // Leading zeros in coefficient are handled; fractional length adjusts exponent
 * convertExponentialToParts(1, "0009.500e2"); // 9.500 × 10^2 = 950
 * // => { sign: 1, integerPart: "950", fractionalPart: "" }
 * ```
 *
 * @example
 * ```ts
 * // You can reconstruct a normalized decimal string yourself:
 * const { sign, integerPart, fractionalPart } = convertExponentialToParts(-1, "1.234e-2");
 * const signChar = sign < 0 ? "-" : "";
 * const plain = fractionalPart ? `${integerPart}.${fractionalPart}` : integerPart;
 * // plain == "0.01234"
 * const result = signChar + plain; // "-0.01234"
 * ```
 *
 * @see isNumPZ — utility used here to detect non-negative integers (exponent ≥ 0).
 *
 * @since 2.0.0
 */
export function convertExponentialToParts(
	sign: 1 | -1,
	exponentialString: string
): { sign: 1 | -1; integerPart: string; fractionalPart: string } {
	const match = /^([0-9]+)(?:\.([0-9]*))?e([+\-]?[0-9]+)$/i.exec(
		(() => {
			const [coefficient, exponentText] = exponentialString.split(/e/i);
			const [integerPart, fractionalPart = ''] = coefficient.split('.');
			const allDigits = integerPart.replace(/^0+/, '') + fractionalPart;
			const exponentValue = parseInt(exponentText, 10) - fractionalPart.length;
			
			return `${allDigits || '0'}e${exponentValue}`;
		})()
	);

	if (!match) {
		throw new Error('Failed to parse exponential notation.');
	}
	let allDigits = match[1];
	const exponent = parseInt(match[3], 10);

	if (isNumPZ(exponent)) {
		allDigits = allDigits + '0'.repeat(exponent);
		
		return { 
			sign, 
			integerPart: allDigits || '0', 
			fractionalPart: '', 
		};
	} 
	else {
		const digitsToLeft = -exponent;
		
		if (digitsToLeft >= allDigits.length) {
			const missingZeros = '0'.repeat(digitsToLeft - allDigits.length);
			
			return {
				sign,
				integerPart: '0',
				fractionalPart: missingZeros + allDigits,
			};
		}
		else {
			const splitIndex = allDigits.length - digitsToLeft;
			
			return {
				sign,
				integerPart: allDigits.slice(0, splitIndex),
				fractionalPart: allDigits.slice(splitIndex),
			};
		}
	}
}