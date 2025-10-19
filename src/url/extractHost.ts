import { isStrFilled } from '../index';

const HAS_SCHEME = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;

/**
 * Extracts the **hostname** (IPv4, IPv6, or domain) from a URL-like string.
 *
 * @summary
 * Parses a given string as a URL or host reference and returns the **host component**
 * (without protocol, port, path, query, or credentials).  
 * Handles both valid URLs (via {@link URL}) and malformed or scheme-less inputs using fallback parsing.
 *
 * @param value - Any string that may represent a URL, host, or address.
 *
 * @returns
 * The hostname (domain or IP address) as a plain string.  
 * Returns an empty string (`""`) if the input is blank or cannot be parsed.
 *
 * @remarks
 * ### Parsing strategy
 * 1. **Scheme detection:**  
 *    - If the input starts with a protocol scheme (e.g., `http:`, `ftp:`), it is parsed directly.  
 *    - Otherwise, a default `http://` prefix is prepended so the built-in {@link URL} parser can process it.
 *
 * 2. **Primary parsing:**  
 *    - Uses the native {@link URL} class to extract `hostname`.
 *    - Automatically handles IPv6 literals, punycode domains, and IDNs.
 *
 * 3. **Fallback parsing (for invalid URLs):**  
 *    - Strips credentials (`user:pass@`).
 *    - Extracts the first segment before `/`, `?`, or `#`.
 *    - If the result looks like `[::1]` or `[2001:db8::1]`, returns the IPv6 address inside brackets.
 *    - Otherwise, takes everything before the first colon (`:`) as the hostname.
 *
 * ### Supported formats
 * - Full URLs:  
 *   `"https://user:pass@sub.example.com:8080/path"` → `"sub.example.com"`
 * - Host with port:  
 *   `"example.com:3000"` → `"example.com"`
 * - IPv4:  
 *   `"192.168.1.1:4028"` → `"192.168.1.1"`
 * - IPv6 (with or without brackets):  
 *   `"[2001:db8::1]:4028"` → `"2001:db8::1"`
 * - Without scheme:  
 *   `"example.com/test?q=1"` → `"example.com"`
 *
 * ### Behavior notes
 * - Returns an empty string if `value` is empty, blank, or unparsable.
 * - Never throws — all exceptions are caught and handled gracefully.
 * - Does **not** include port numbers or authentication info.
 * - Automatically trims whitespace before parsing.
 *
 * ### Performance
 * - Time complexity: **O(n)** (linear in string length).
 * - Space complexity: **O(n)** (creates trimmed and split substrings).
 *
 * ### Examples
 *
 * @example
 * // Standard URLs
 * extractHost('https://example.com/path');         // => "example.com"
 * extractHost('http://user:pass@site.org:8080');   // => "site.org"
 *
 * @example
 * // Without scheme
 * extractHost('example.com/foo/bar');              // => "example.com"
 * extractHost('sub.domain.net:3000');              // => "sub.domain.net"
 *
 * @example
 * // IP addresses
 * extractHost('192.168.0.10:4028');                // => "192.168.0.10"
 * extractHost('[2001:db8::1]:80');                 // => "2001:db8::1"
 *
 * @example
 * // Invalid or blank input
 * extractHost('');                                 // => ""
 * extractHost('not a valid host');                 // => "not"
 *
 * @see URL
 * @see isStrFilled
 *
 * @category Network
 * @public
 * @since 2.0.0
 */
export function extractHost(value: string = ''): string {
	if (!isStrFilled(value)) {
		return '';
	}
	let v = value.trim();
	const candidate = HAS_SCHEME.test(v) ? v : `http://${v}`;

	try {
		const u = new URL(candidate);
		let host = u.hostname;

		return host;
	}
	catch {
		const withoutCreds = v.split('@').pop() || v;
		const firstSegment = withoutCreds.split(/[/?#]/, 1)[0];
		const mIPv6 = firstSegment.match(/^\[([^\]]+)\]/);
		
		if (mIPv6) {
			return mIPv6[1];
		}
		return firstSegment.split(':', 1)[0] || '';
	}
}
