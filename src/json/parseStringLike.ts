import type { JSONLike } from '../index';
import { tryParseJSON } from '../index';

/**
 * Matches strings surrounded by a single, double, or backtick quote.
 *
 * @example
 * ```ts
 * QUOTED_RE.test(`"hello"`); // true
 * QUOTED_RE.test(`'world'`); // true
 * QUOTED_RE.test('`foo`');   // true
 * QUOTED_RE.test('bar');     // false
 * ```
 *
 * @internal
 */
const QUOTED_RE = /^(['"`])([\s\S]*)\1$/;

/**
 * Parses a string that may represent JSON, quoted scalars, or plain text.
 *
 * @remarks
 * The parsing order is:
 *
 * 1. Try JSON via {@link tryParseJSON}. If it works, return the parsed value.
 * 2. If not JSON, check if the string is quoted with `'`, `"` or `` ` ``.
 *    If quoted, return the **unquoted** inner text.
 * 3. If not quoted:
 *    - If `allowString === true`, return the **trimmed** string as-is.
 *    - Otherwise return `null`.
 *
 * This helper is used recursively by {@link jsonDecode} to decode string fields
 * found inside arrays/objects.
 *
 * @param s - Source string.
 * @param allowString - Whether to allow returning raw (unquoted) strings.
 * @returns A JSON-like value, or `null` if the string cannot be interpreted
 *          and `allowString` is `false`.
 *
 * @example
 * ```ts
 * parseStringLike('{"a":1}', false); // -> { a: 1 }
 * parseStringLike('"hello"', false); // -> "hello"
 * parseStringLike('hello', false);   // -> null
 * parseStringLike('hello', true);    // -> "hello"
 * ```
 *
 * @internal
 */
export function parseStringLike(s: string, allowString: boolean): JSONLike | null {
	const trimmed = s.trim();
	const pr = tryParseJSON(trimmed);
	
	if (pr.ok) {
		return pr.value;
	}
	const m = QUOTED_RE.exec(trimmed);
	
	if (m) {
		return m[2] as JSONLike;
	}
	return allowString ? (trimmed as JSONLike) : null;
}