import { isStr } from '../is/isStr';
import { formatToTrim } from './formatToTrim';

/**
 * Normalizes and validates a phone number into international format (`E.164` style).
 *
 * @summary
 * Converts various human-entered phone number formats (with spaces, dashes, parentheses,
 * or local prefixes) into a clean, standardized string beginning with `"+"`
 * and containing 10–15 digits.
 *
 * Returns `null` if the value is not a valid phone number after normalization.
 *
 * @param value - The input value to format. Can be any unknown type; only strings are processed.
 * @param defaultCountry - Optional international prefix to prepend for 10-digit local numbers
 *                         (defaults to `"+7"` — Russia/Kazakhstan).  
 *                         Use your target country code (e.g., `"+34"` for Spain, `"+1"` for USA).
 *
 * @returns
 * A normalized phone number in `+XXXXXXXXXX` format if valid, or `null` if the input
 * cannot be interpreted as a valid number.
 *
 * @remarks
 * ### Normalization rules
 * 1. **Input validation:**  
 *    If `value` is not a string, returns `null`.
 *
 * 2. **Trimming and cleaning:**  
 *    Removes all whitespace, hyphens, parentheses, and dots.
 *    Example:  
 *    `" (123) 456-7890 "` → `"1234567890"`.
 *
 * 3. **International formats:**
 *    - `00` prefix (common in Europe) is replaced with `"+"`.  
 *      → `"0049123456789"` → `"+49123456789"`.
 *
 * 4. **Local numbers (10 digits):**  
 *    Prepends the `defaultCountry` code.  
 *    → `"1234567890"` → `"+71234567890"` (default country `+7`).
 *
 * 5. **Generic international numbers (9–15 digits):**  
 *    If not starting with `"0"`, adds `"+"` prefix.  
 *    → `"380501234567"` → `"+380501234567"`.
 *
 * 6. **Validation check:**  
 *    The result must match the pattern `/^\+\d{10,15}$/`  
 *    — i.e., plus sign followed by 10–15 digits.  
 *    If not, returns `null`.
 *
 * ### Error safety
 * - Never throws — all invalid or unexpected inputs return `null`.
 * - Automatically cleans up common formatting symbols without side effects.
 *
 * ### Performance
 * - Time complexity: **O(n)** (string length).
 * - Space complexity: **O(n)** (new string creation during cleanup).
 *
 * ### Common pitfalls
 * - Numbers starting with `"0"` are **rejected**, since they are ambiguous.
 * - 8-digit local formats are not automatically expanded — use a country-specific parser if needed.
 * - This function performs **basic formatting and validation**, not full ITU-T E.164 compliance.
 *
 * ### Examples
 *
 * @example
 * // International format already valid
 * formatToPhone('+380501234567');         // => "+380501234567"
 *
 * @example
 * // European "00" prefix
 * formatToPhone('00442079460729');        // => "+442079460729"
 *
 * @example
 * // Local 10-digit number (default country +7)
 * formatToPhone('9123456789');            // => "+79123456789"
 *
 * @example
 * // With custom default country
 * formatToPhone('9876543210', '+34');     // => "+349876543210"
 *
 * @example
 * // Strings with spaces, punctuation, parentheses
 * formatToPhone('(050) 123-45-67');       // => "+70501234567"
 * formatToPhone('+1 (202) 555-0183');     // => "+12025550183"
 *
 * @example
 * // Invalid or ambiguous inputs
 * formatToPhone('');                      // => null
 * formatToPhone('000123456');             // => null
 * formatToPhone('abcdefgh');              // => null
 * formatToPhone(null);                    // => null
 * formatToPhone(true);                    // => null
 *
 * @see isStr
 * @see formatToTrim
 *
 * @category String
 * @public
 * @since 1.0.0
 */
export function formatToPhone(value?: unknown, defaultCountry = '+7'): string | null {
	if (!isStr(value)) {
		return null;
	}
	let phone = formatToTrim(value).replace(/[\s\-().]/g, '');

	if (/^00\d{8,15}$/.test(phone)) {
		phone = '+' + phone.slice(2);
	}
	else if (/^\d{10}$/.test(phone)) {
		phone = defaultCountry + phone;
	}
	else if (/^\d{9,15}$/.test(phone) && !phone.startsWith('0')) {
		phone = '+' + phone;
	}
	return /^\+\d{10,15}$/.test(phone) ? phone : null;
}
