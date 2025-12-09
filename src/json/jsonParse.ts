import type { JSONLike } from '../index';

/**
 * Attempts to parse a string using native {@link JSON.parse}.
 *
 * @remarks
 * Returns a discriminated union with `{ ok: true, value }` on success,
 * or `{ ok: false }` on any parsing error. Exceptions are caught and
 * **never thrown** to callers.
 *
 * @param str - The candidate JSON string.
 * @returns A result object indicating parse success/failure.
 *
 * @example
 * ```ts
 * jsonParse('{"a":1}'); // { ok: true, value: { a: 1 } }
 * jsonParse('not json'); // { ok: false }
 * ```
 *
 * @internal
 */
export function jsonParse(str: string): { ok: true; value: JSONLike } | { ok: false } {
	try {
		return { ok: true, value: JSON.parse(str) as JSONLike };
	} 
	catch (err) {
	}
	return { ok: false };
}