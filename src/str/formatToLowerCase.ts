import { 
	isStrFilled,
	isStr,
	formatToTrim, 
} from '../index';

/**
 * Converts any given string-like value into a lower-cased, trimmed string.
 *
 * @summary
 * Safely transforms an unknown value into a normalized lowercase string.
 * If the input is not a valid non-empty string, the function returns an empty string (`""`).
 *
 * @param value - Any unknown input to convert to lowercase.
 *
 * @returns A lowercase string, or an empty string if the input is not a valid string.
 *
 * @remarks
 * ### Processing steps
 * 1. **Type check** — ensures the input is a string using {@link isStr}.
 * 2. **Trimming** — removes leading and trailing whitespace via {@link formatToTrim}.
 * 3. **Validation** — ensures the result is non-empty with {@link isStrFilled}.
 * 4. **Lowercasing** — calls `String.prototype.toLowerCase()` on the trimmed text.
 * 5. If the string is empty or not valid at any step, returns `""`.
 *
 * ### Error safety
 * - The function **never throws**, regardless of input type.
 * - Non-string inputs (numbers, booleans, objects, arrays, `null`, `undefined`) all yield `""`.
 *
 * ### Use cases
 * - Case-insensitive string comparison (normalize both sides with `formatToLowerCase`).
 * - Normalizing user input before storing or indexing.
 * - Simplifying logic where optional strings may be `null` or empty.
 *
 * ### Performance
 * - Time complexity: **O(n)** (where `n` = string length, due to trimming and lowercasing).
 * - Space complexity: **O(n)** (new string created by normalization).
 *
 * ### Examples
 *
 * @example
 * // Basic strings
 * formatToLowerCase('HELLO');        // => "hello"
 * formatToLowerCase('  TEST ');      // => "test"
 *
 * @example
 * // Mixed types
 * formatToLowerCase(123);            // => ""
 * formatToLowerCase(true);           // => ""
 * formatToLowerCase(null);           // => ""
 *
 * @example
 * // Empty or whitespace inputs
 * formatToLowerCase('   ');          // => ""
 * formatToLowerCase('');             // => ""
 *
 * @example
 * // Already lowercase
 * formatToLowerCase('data');         // => "data"
 *
 * @see isStr
 * @see isStrFilled
 * @see formatToTrim
 *
 * @category String
 * @public
 * @since 2.0.0
 */
export function formatToLowerCase(value?: unknown): string {
	if (!isStr(value)) {
		return '';
	}
	const trimmed = formatToTrim(value);
	
	return isStrFilled(trimmed) ? trimmed.toLowerCase() : '';
}
