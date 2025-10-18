import { isStrFilled } from './isStrFilled';
import { isNum } from './isNum';

/**
 * Checks whether a given value is a **valid phone number** in a generic international format.
 *
 * @summary
 * A flexible, language-neutral phone number validator that accepts both string and numeric inputs.  
 * It supports optional leading `"+"`, allows dashes (`"-"`) as separators, and ensures that the
 * number structure is syntactically valid — not necessarily region-specific.
 *
 * @param value - Any value to test (string or number).
 *
 * @returns `true` if the value represents a valid phone-like number, otherwise `false`.
 *
 * @remarks
 * ### Validation logic
 * 1. **Type check:**  
 *    Accepts strings and finite numbers (`isStrFilled` or `isNum` must pass).
 * 2. **Normalization:**  
 *    Converts to string and trims whitespace.
 * 3. **Negative or misplaced signs:**  
 *    Rejects numbers starting with `"-"`.
 * 4. **Plus sign validation:**  
 *    - Only one `+` is allowed.  
 *    - If present, it must appear **only at the start**.
 * 5. **Character whitelist:**  
 *    The number must match the pattern `/^\+?[0-9-]+$/`,  
 *    i.e., only digits, dashes, and an optional leading plus sign.
 * 6. **Length check:**  
 *    Must be between **3** and **20** characters (inclusive).
 * 7. **Ending rule:**  
 *    The last character must be a digit.
 * 8. **Double-dash check:**  
 *    Rejects sequences containing `"--"`.
 *
 * ### Behavior
 * - Accepts: `+1234567890`, `380-67-123-4567`, `79001234567`, `12345`.
 * - Rejects: `"--123"`, `"++123"`, `"12a34"`, `"12 34"`, `"-123"`, `"123-"`.
 * - Not region-specific — does **not** check country codes or local dialing rules.
 * - Designed for structural validation only.
 *
 * ### Comparison
 * | Example              | Valid | Reason                          |
 * |----------------------|:------:|--------------------------------|
 * | `+380671234567`      | true | Proper international format      |
 * | `067-123-4567`       | true | Local format with dashes         |
 * | `123`                | true | Minimum valid length             |
 * | `+12-34-56--78`      | false | Contains `"--"`                 |
 * | `+12A345`            | false | Contains letters                |
 * | `123-`               | false | Ends with non-digit             |
 * | `++38050`            | false | Multiple `"+"` symbols          |
 * | `380+501234`         | false | Misplaced plus                  |
 *
 * ### Type narrowing
 * When this function returns `true`, TypeScript infers:
 * ```ts
 * value is string
 * ```
 * even if the original value was numeric — ensuring it can be safely stored or formatted as text.
 *
 * ### Performance
 * - Time complexity: **O(n)** — single regex checks and scans.
 * - Space complexity: **O(1)**.
 *
 * ### Examples
 *
 * @example
 * // Valid international numbers
 * isPhone('+380671234567');     // => true
 * isPhone('380-67-123-4567');   // => true
 * isPhone(380501234567);        // => true
 *
 * @example
 * // Invalid formats
 * isPhone('--12345');            // => false
 * isPhone('+12+34');             // => false
 * isPhone('12A345');             // => false
 * isPhone('123-');               // => false
 * isPhone('');                   // => false
 *
 * @example
 * // Type narrowing
 * const val: unknown = '+14155552671';
 * if (isPhone(val)) {
 *   console.log(val.replace(/\D/g, '')); // safe normalization
 * }
 *
 * @see isStrFilled
 * @see isNum
 * @see formatToPhone
 *
 * @category Validation
 * @public
 * @since 1.0.0
 */
export function isPhone(value: unknown): value is string {
	if (!isStrFilled(value) 
		&& !isNum(value)) {
		return false;
	}
	const valueProcessed = String(value).trim();

	if (valueProcessed.startsWith('-')) {
		return false;
	}
	if ((valueProcessed.match(/\+/g) || []).length > 1) {
		return false;
	}
	if (valueProcessed.includes('+') && !valueProcessed.startsWith('+')) {
		return false;
	}
	if (!/^\+?[0-9-]+$/.test(valueProcessed)) {
		return false;
	}
	if (valueProcessed.length < 3 || valueProcessed.length > 20) {
		return false;
	}
	if (!/[0-9]$/.test(valueProcessed)) {
		return false;
	}
	if (valueProcessed.includes('--')) {
		return false;
	}
	return true;
}
