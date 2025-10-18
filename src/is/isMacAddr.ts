import { isStr } from './isStr';

/**
 * Checks whether a given value is a **valid MAC address**.
 *
 * @summary
 * Validates that the input is a string formatted as a standard 6-octet
 * MAC (Media Access Control) address, consisting of 12 hexadecimal digits
 * separated by either colons (`:`) or hyphens (`-`).
 *
 * @param value - Any value to test (typically a string from user input or network data).
 *
 * @returns `true` if the value matches the MAC address pattern, otherwise `false`.
 *
 * @remarks
 * ### Accepted formats
 * - `00:1A:2B:3C:4D:5E`
 * - `00-1A-2B-3C-4D-5E`
 * - Both uppercase and lowercase hexadecimal digits are allowed.
 * - Mixed separators (e.g., `"00:1A-2B:3C-4D:5E"`) are **not** accepted.
 *
 * ### Validation logic
 * 1. Confirms that `value` is a string via {@link isStr}.
 * 2. Uses the following regular expression:
 *    ```
 *    /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
 *    ```
 *    which enforces:
 *    - Exactly 6 byte segments (`xx:xx:xx:xx:xx:xx` or `xx-xx-xx-xx-xx-xx`)
 *    - Each segment: two hexadecimal digits (`0–9`, `A–F`, `a–f`)
 *    - A consistent separator (`:` or `-`)
 *
 * ### Behavior notes
 * - Returns `false` for empty strings, non-strings, or malformed addresses.
 * - Does **not** support 8-octet EUI-64 or Cisco short 3-octet formats.
 * - Does **not** check for broadcast or multicast address semantics — only syntax.
 *
 * ### Performance
 * - Time complexity: **O(1)** (fixed regex match)
 * - Space complexity: **O(1)** (no allocations beyond regex)
 *
 * ### Examples
 *
 * @example
 * // Valid MAC addresses
 * isMacAddr('00:1A:2B:3C:4D:5E');  // => true
 * isMacAddr('AA-BB-CC-DD-EE-FF');  // => true
 * isMacAddr('ff:ff:ff:ff:ff:ff');  // => true
 *
 * @example
 * // Invalid MAC addresses
 * isMacAddr('00:1A:2B:3C:4D');     // => false   (too short)
 * isMacAddr('00:1A:2B:3C:4D:5E:7F'); // => false (too long)
 * isMacAddr('00:1A:2B:3C:4D:ZZ');  // => false   (invalid hex)
 * isMacAddr('001A.2B3C.4D5E');     // => false   (wrong format)
 * isMacAddr('');                   // => false
 *
 * @example
 * // Non-string values
 * isMacAddr(null);                 // => false
 * isMacAddr(undefined);            // => false
 * isMacAddr(123456);               // => false
 *
 * @see isStr
 * @see isIp
 *
 * @category Validation
 * @public
 * @since 1.0.0
 */
export function isMacAddr(value: unknown): value is string {
	return isStr(value) && /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(value);
}
