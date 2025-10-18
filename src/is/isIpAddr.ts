import { isStr } from './isStr';

const IPV4_RE = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;

/**
 * Checks whether a given value is a **valid IPv4 address**.
 *
 * @summary
 * Validates that the input is a string containing four octets (e.g. `"192.168.0.1"`),
 * where each octet is a number between `0` and `255`, separated by dots.
 *
 * @param value - Any value to test (string or unknown).
 *
 * @returns `true` if the value is a syntactically valid IPv4 address, otherwise `false`.
 *
 * @remarks
 * ### Validation steps
 * 1. Ensures the input is a string via {@link isStr}.
 * 2. Trims leading and trailing whitespace.
 * 3. Tests the cleaned string against a strict regular expression for IPv4 format:
 *    ```
 *    /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.
 *      (25[0-5]|2[0-4]\d|[01]?\d\d?)\.
 *      (25[0-5]|2[0-4]\d|[01]?\d\d?)\.
 *      (25[0-5]|2[0-4]\d|[01]?\d\d?)$/
 *    ```
 *    Each group allows:
 *    - `0–9`, `00–99`, `100–199`, `200–249`, `250–255`
 *
 * ### Behavior notes
 * - Returns `false` for non-strings, empty strings, or malformed IPs.
 * - Does **not** support IPv6 (use a separate validator for that).
 * - Does **not** perform CIDR or subnet validation — only syntax checking.
 * - Leading zeros are allowed (e.g. `"010.000.000.001"` is accepted, as per regex).
 *
 * ### Performance
 * - Time complexity: **O(1)** (fixed regex evaluation).
 * - Space complexity: **O(1)**.
 *
 * ### Examples
 *
 * @example
 * // Valid IPv4 addresses
 * isIpAddr('192.168.0.1');     // => true
 * isIpAddr('8.8.8.8');         // => true
 * isIpAddr('0.0.0.0');         // => true
 * isIpAddr('255.255.255.255'); // => true
 *
 * @example
 * // Invalid IPv4 strings
 * isIpAddr('256.0.0.1');       // => false  (octet > 255)
 * isIpAddr('192.168.0');       // => false  (missing octet)
 * isIpAddr('192.168.0.1.5');   // => false  (too many octets)
 * isIpAddr('192.168.0.A');     // => false  (non-numeric)
 * isIpAddr('192,168,0,1');     // => false  (wrong separator)
 *
 * @example
 * // Non-string inputs
 * isIpAddr(12345);             // => false
 * isIpAddr(null);              // => false
 * isIpAddr(undefined);         // => false
 *
 * @see isStr
 *
 * @category Validation
 * @public
 * @since 1.0.0
 */
export function isIpAddr(value: unknown): value is string {
	if (!isStr(value)) {
		return false;
	}
	const v = value.trim();
	
	return IPV4_RE.test(v);
}
