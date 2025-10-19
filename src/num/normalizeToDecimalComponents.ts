import { convertExponentialToParts } from '../index';

/**
 * Normalizes an arbitrary numeric input into sign, integer, and fractional string parts
 * without losing precision, preparing it for exact fixed-decimal processing.
 *
 * @remarks
 * This utility accepts `bigint`, `number`, and `string` inputs and returns a tuple-like
 * object with three fields:
 *
 * - `sign`: `1` for non-negative values, `-1` for negative values.
 * - `integerPart`: the digits before the decimal point as a string (no sign, no separators).
 * - `fractionalPart`: the digits after the decimal point as a string (no sign, no separators).
 *
 * For JavaScript `number`s, the function first checks finiteness and then converts the
 * absolute value to an exponential string (via `toExponential(30)`) to avoid
 * floating-point artifacts when extracting digits. It delegates parsing of that exponential
 * form to {@link convertExponentialToParts}.
 *
 * For `string`s, the function:
 * - Trims whitespace and replaces a comma `,` decimal separator with a dot `.`.
 * - Parses and removes a leading `+`/`-` sign (if present).
 * - Validates the remaining characters with a permissive numeric pattern that allows:
 *   - optional integer digits,
 *   - an optional decimal point with digits,
 *   - an optional scientific exponent (`e` or `E` with optional `+`/`-` and digits).
 * - If an exponent is present, it delegates to {@link convertExponentialToParts};
 *   otherwise it splits on the decimal point.
 *
 * **Important:** This function does not strip leading zeros in `integerPart` or trailing
 * zeros in `fractionalPart`. If you need canonicalized output (e.g., remove leading/trailing
 * zeros), do that in a later step (e.g., when building your fixed-decimal representation).
 *
 * @param input - The numeric input to normalize. Supported types:
 * - `bigint` (e.g., `123n`, `-9007199254740993n`)
 * - `number` (finite only; `NaN`, `Infinity`, `-Infinity` will throw)
 * - `string` (e.g., `"42"`, `"-0.034"`, `"1.2e-5"`, with optional leading sign, optional
 *   decimal part, optional exponent; commas are allowed as decimal separators and are
 *   converted to dots)
 *
 * @returns An object with the normalized components:
 * ```ts
 * {
 *   sign: 1 | -1;
 *   integerPart: string;
 *   fractionalPart: string;
 * }
 * ```
 * The `integerPart` and `fractionalPart` contain only ASCII digits (`0`–`9`) and
 * **never** include sign or exponent markers.
 *
 * @throws {Error}
 * - If `input` is a `number` but not finite (`NaN`, `Infinity`, `-Infinity`).
 * - If `input` is a `string` that is empty after trimming/replacement.
 * - If `input` is a `string` that fails the numeric validation regex.
 * - If `input` is of an unsupported type (not `bigint`, `number`, or `string`).
 * - Any errors propagated from {@link convertExponentialToParts} when parsing exponential forms.
 *
 * @example
 * // bigint input → fractional part is empty
 * normalizeToDecimalComponents(123n);
 * // => { sign: 1, integerPart: "123", fractionalPart: "" }
 *
 * @example
 * // negative bigint
 * normalizeToDecimalComponents(-987654321n);
 * // => { sign: -1, integerPart: "987654321", fractionalPart: "" }
 *
 * @example
 * // finite number input; uses exponential internally to avoid FP artifacts
 * normalizeToDecimalComponents(0.0000034);
 * // => { sign: 1, integerPart: "0", fractionalPart: "0000034" }  // exact digits
 *
 * @example
 * // string with decimal comma and explicit sign
 * normalizeToDecimalComponents("+1,250");
 * // => { sign: 1, integerPart: "1", fractionalPart: "250" }
 *
 * @example
 * // scientific notation string
 * normalizeToDecimalComponents("-1.234e+3");
 * // => { sign: -1, integerPart: "1234", fractionalPart: "" }
 *
 * @example
 * // invalid string (throws)
 * normalizeToDecimalComponents("12.34.56"); // Error: Invalid numeric string.
 *
 * @see convertExponentialToParts
 * @category Parsing
 * @since 2.0.0
 * @public
 */
export function normalizeToDecimalComponents(input: unknown): {
	sign: 1 | -1;
	integerPart: string;
	fractionalPart: string;
} {
	if (typeof input === 'bigint') {
		const sign: 1 | -1 = input < 0n ? -1 : 1;
		const absoluteValue = (input < 0n ? -input : input).toString();
		
		return { 
			sign, 
			integerPart: absoluteValue, 
			fractionalPart: '', 
		};
	}
	if (typeof input === 'number') {
		if (!Number.isFinite(input)) {
			throw new Error('Input number is not finite.');
		}
		const sign: 1 | -1 = input < 0 ? -1 : 1;
		const absoluteValue = Math.abs(input);
		const exponentialForm = absoluteValue.toExponential(30); // например "1.23456e-5"
		
		return convertExponentialToParts(sign, exponentialForm);
	}
	if (typeof input === 'string') {
		let processed = input.trim().replace(',', '.');
		
		if (!processed) {
			throw new Error('Input string is empty.');
		}
		let sign: 1 | -1 = 1;
		
		if (processed.startsWith('+') || processed.startsWith('-')) {
			sign = processed.startsWith('-') ? -1 : 1;
			processed = processed.slice(1);
		}
		if (/^[0-9]*\.?[0-9]*(e[+\-]?[0-9]+)?$/i.test(processed)) {
			if (/e/i.test(processed)) {
				return convertExponentialToParts(sign, processed);
			}
			const [ integerPart = '0', fractionalPart = '' ] = processed.split('.');
			
			return { 
				sign, 
				integerPart, 
				fractionalPart, 
			};
		}
		throw new Error('Invalid numeric string.');
	}
	throw new Error('Unsupported input type.');
}