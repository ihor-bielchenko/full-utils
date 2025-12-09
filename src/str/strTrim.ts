import { isStr } from '../index';


/**
 * Trims, normalizes, and cleans up invisible characters from a string.
 *
 * @summary
 * Safely converts any input into a clean, Unicode-normalized string with all
 * leading/trailing whitespace removed and zero-width characters stripped out.
 *  
 * Returns an empty string (`""`) for all non-string inputs.
 *
 * @param value - Any value that may contain text or string-like content.
 *
 * @returns A normalized, trimmed string without invisible Unicode separators.
 * Returns an empty string if `value` is not a string.
 *
 * @remarks
 * ### Processing steps
 * 1. **Type check:**  
 *    Uses {@link isStr} to ensure the input is a string.  
 *    Non-strings are converted to `""`.
 *
 * 2. **Trimming:**  
 *    Removes all leading and trailing whitespace (`String.prototype.trim()`).
 *
 * 3. **Unicode normalization:**  
 *    Applies `normalize('NFKC')` — Compatibility Composition — which:
 *    - Converts full-width and compatibility forms into canonical ones.  
 *      Example: `"ＡＢＣ"` → `"ABC"`.
 *    - Normalizes composed characters (e.g., `"é"` vs `"é"`).
 *
 * 4. **Invisible character cleanup:**  
 *    Removes hidden zero-width Unicode characters commonly introduced by copy/paste:
 *    - `U+200B` ZERO WIDTH SPACE  
 *    - `U+200C` ZERO WIDTH NON-JOINER  
 *    - `U+200D` ZERO WIDTH JOINER  
 *    - `U+FEFF` ZERO WIDTH NO-BREAK SPACE (BOM)
 *
 * 5. **Safe stringification:**  
 *    Non-string values are returned as empty string rather than `"undefined"` or `"null"`.
 *
 * ### Benefits
 * - Eliminates subtle text differences that break comparisons or hashing.
 * - Prevents user input issues caused by hidden characters.
 * - Safe to use in both frontend and backend environments.
 *
 * ### Performance
 * - Time complexity: **O(n)** — proportional to the input string length.
 * - Space complexity: **O(n)** — creates a new normalized copy.
 *
 * ### Common use cases
 * - Sanitizing user input before validation or storage.
 * - Cleaning keys, tags, and names from external data sources.
 * - Preparing values for strict equality or hashing.
 *
 * ### Examples
 *
 * @example
 * // Basic trimming
 * strTrim('  Hello  ');            // => "Hello"
 *
 * @example
 * // Removes zero-width characters
 * strTrim('word\u200B');           // => "word"
 *
 * @example
 * // Unicode normalization
 * strTrim('ＡＢＣ');               // => "ABC"
 * strTrim('e\u0301');              // => "é"
 *
 * @example
 * // Non-string inputs
 * strTrim(123);                    // => ""
 * strTrim(null);                   // => ""
 * strTrim(undefined);              // => ""
 * strTrim({ text: 'hi' });         // => ""
 *
 * @see isStr
 * @see String.prototype.normalize
 *
 * @category String
 * @public
 * @since 2.0.0
 */
export function strTrim(value: unknown): string {
	return String(isStr(value) ? value.trim().normalize('NFKC').replace(/[\u200B-\u200D\uFEFF]/g, '') : '');	
}
