import { isStrFilled } from '../index';

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;

/**
 * Checks whether a given value is a **valid email address**.
 *
 * @summary
 * Validates that the input is a non-empty string and matches a simplified but
 * practical email pattern according to RFC 5322-compatible syntax rules.
 *
 * @param value - Any value to test (string or unknown).
 *
 * @returns `true` if the value is a non-empty string that looks like a valid email,  
 * otherwise `false`.
 *
 * @remarks
 * ### Validation process
 * 1. Ensures the input is a **non-empty string** via {@link isStrFilled}.
 * 2. Tests the value against a precompiled **regular expression**:
 *    ```
 *    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+
 *     @[a-zA-Z0-9]
 *     (?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?
 *     (?:\.[a-zA-Z]{2,})+$/
 *    ```
 *    This allows standard ASCII characters in the local part and enforces:
 *    - at least one `@` separator  
 *    - valid domain and subdomain segments  
 *    - a top-level domain of at least two letters.
 *
 * ### Behavior notes
 * - Returns `false` for empty strings, `null`, `undefined`, or non-string inputs.
 * - Does **not** perform DNS or MX record validation — only syntactic matching.
 * - Intended for lightweight client-side or structural checks.
 * - If you need full compliance with RFC 6531 (Unicode / IDN), normalize the address first.
 *
 * ### Performance
 * - Time complexity: **O(n)** — proportional to input length.
 * - Space complexity: **O(1)**.
 * - The compiled regex is cached and reused for efficiency.
 *
 * ### Examples
 *
 * @example
 * // Valid emails
 * isEmail('user@example.com');           // => true
 * isEmail('john.doe+alias@mail.co.uk');  // => true
 *
 * @example
 * // Invalid formats
 * isEmail('');                           // => false
 * isEmail('user@');                      // => false
 * isEmail('@example.com');               // => false
 * isEmail('user@@example.com');          // => false
 * isEmail('user example@domain.com');    // => false
 *
 * @example
 * // Non-string inputs
 * isEmail(null);                         // => false
 * isEmail(undefined);                    // => false
 * isEmail(12345);                        // => false
 *
 * @see isStrFilled
 *
 * @category Validation
 * @public
 * @since 2.0.0
 */
export function isEmail(value: unknown): value is string {
	if (!isStrFilled(value)) {
		return false;
	}
	return emailRegex.test(value);
}
