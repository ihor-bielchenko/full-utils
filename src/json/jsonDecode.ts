import { isArrFilled } from '../is/isArrFilled';
import { isArr } from '../is/isArr';
import { isObjFilled } from '../is/isObjFilled';
import { isObj } from '../is/isObj';
import { isStrFilled } from '../is/isStrFilled';
import { isNum } from '../is/isNum';
import { isBool } from '../is/isBool';

/**
 * Structural JSON-like type used throughout decoding.
 *
 * @remarks
 * This mirrors the standard JSON value domain:
 * `null`, booleans, numbers, strings, arrays of JSON-like values,
 * and plain object maps with string keys pointing to JSON-like values.
 *
 * @public
 * @category JSON
 * @since 1.0.0
 */
type JSONLike =
	| null
	| boolean
	| number
	| string
	| JSONLike[]
	| { [k: string]: JSONLike };

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
 * tryParseJSON('{"a":1}'); // { ok: true, value: { a: 1 } }
 * tryParseJSON('not json'); // { ok: false }
 * ```
 *
 * @internal
 */
function tryParseJSON(str: string): { ok: true; value: JSONLike } | { ok: false } {
	try {
		return { ok: true, value: JSON.parse(str) as JSONLike };
	} 
	catch (err) {
	}
	return { ok: false };
}

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
function parseStringLike(s: string, allowString: boolean): JSONLike | null {
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

/**
 * Best-effort decoder that normalizes unknown input into a JSON-like value.
 *
 * @remarks
 * `jsonDecode` accepts many shapes of input and produces a `JSONLike` (or `null`)
 * according to the following rules:
 *
 * - **Primitive passthrough**: `null`, numbers, and booleans are returned as-is.
 * - **Arrays/Objects (filled)**: for each string element/property, we attempt to decode
 *   it via {@link parseStringLike} (JSON → unquoted string → raw string if `allowString`).
 *   Non-string items are passed through unchanged (cast to `JSONLike`).
 * - **Arrays/Objects (empty)**: returned as-is (they’re valid JSON).
 * - **Standalone strings**: decoded via {@link parseStringLike}.
 * - **Other values**: return `null`.
 *
 * The function is **non-throwing**; any JSON parse errors are swallowed internally
 * and mapped to either unquoted/raw strings (depending on `allowString`) or `null`.
 *
 * @typeParam T - Target type to cast the normalized result to.  
 * Defaults to `JSONLike`. Use with care — this is a **type cast**, not a runtime check.
 *
 * @param value - The unknown input to decode (can be primitives, arrays, objects, etc.).
 * @param allowString - If `true`, non-JSON, non-quoted strings are returned as trimmed strings.
 *                      If `false`, such strings decode to `null`.
 *
 * @returns The decoded value cast to `T`, or `null` when it cannot be decoded.
 *
 * @example
 * ```ts
 * // 1) Primitives pass through
 * jsonDecode(42);           // 42
 * jsonDecode(true);         // true
 * jsonDecode(null);         // null
 *
 * // 2) JSON string
 * jsonDecode('{"a":[1,"2"]}'); // { a: [1, "2"] }
 *
 * // 3) Quoted string
 * jsonDecode('"hello"'); // "hello"
 *
 * // 4) Raw string with allowString=false (default)
 * jsonDecode('hello');   // null
 *
 * // 5) Raw string with allowString=true
 * jsonDecode('hello', true); // "hello"
 *
 * // 6) Arrays/objects with string fields get per-field decoding
 * jsonDecode({ a: '{"k":1}', b: 'world' }, true);
 * // -> { a: { k: 1 }, b: "world" }
 * ```
 *
 * @security
 * - Uses native `JSON.parse` — safe for untrusted strings provided you do not eval the result.
 * - Does **not** perform schema validation; if you need strict shapes, validate after decoding.
 *
 * @throws Never throws; invalid inputs yield `null` or are passed through per rules above.
 *
 * @public
 * @category JSON
 * @since 1.0.0
 */
export function jsonDecode<T = JSONLike>(value: unknown, allowString = false): T | null {
	if (value === null || isNum(value) || isBool(value)) {
		return value as unknown as T;
	}
	if (isArrFilled(value)) {
		const arr = value as ReadonlyArray<unknown>;
		const out: JSONLike[] = [];
		
		for (const item of arr) {
			if (isStrFilled(item)) {
				out.push(parseStringLike(String(item), allowString));
			}
			else {
				out.push(item as JSONLike);
			}
		}
		return out as unknown as T;
	}
	if (isObjFilled(value)) {
		const src = value as Record<string, unknown>;
		const out: Record<string, JSONLike> = {};
		
		for (const key of Object.keys(src)) {
			const v = src[key];
			
			if (isStrFilled(v)) {
				out[key] = parseStringLike(String(v), allowString);
			} 
			else {
				out[key] = v as JSONLike;
			}
		}
		return out as unknown as T;
	}
	if (isArr(value) || isObj(value)) {
		return value as unknown as T;
	}
	if (isStrFilled(value)) {
		return parseStringLike(String(value), allowString) as unknown as T;
	}
	return null;
}
