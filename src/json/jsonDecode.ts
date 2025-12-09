import type { JSONLike } from '../index';
import { 
	isArrFilled,
	isArr, 
	isObjFilled,
	isObj,
	isStrFilled,
	isNum,
	isBool,
	jsonEncode,
	jsonStrLike,
} from '../index';

/**
 * Best-effort decoder that normalizes unknown input into a JSON-like value.
 *
 * @remarks
 * `jsonDecode` accepts many shapes of input and produces a `JSONLike` (or `null`)
 * according to the following rules:
 *
 * - **Primitive passthrough**: `null`, numbers, and booleans are returned as-is.
 * - **Arrays/Objects (filled)**: for each string element/property, we attempt to decode
 *   it via {@link jsonStrLike} (JSON → unquoted string → raw string if `allowString`).
 *   Non-string items are passed through unchanged (cast to `JSONLike`).
 * - **Arrays/Objects (empty)**: returned as-is (they’re valid JSON).
 * - **Standalone strings**: decoded via {@link jsonStrLike}.
 * - **Other values**: return `null`.
 *
 * The function is **non-throwing**; any JSON parse errors are swallowed internally
 * and mapped to either unquoted/raw strings (depending on `allowString`) or `null`.
 * 
 * - Uses native `JSON.parse` — safe for untrusted strings provided you do not eval the result.
 * - Does **not** perform schema validation; if you need strict shapes, validate after decoding.
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
 * @throws Never throws; invalid inputs yield `null` or are passed through per rules above.
 *
 * @public
 * @category JSON
 * @since 2.0.0
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
				out.push(jsonStrLike(String(item), allowString));
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
				out[key] = jsonStrLike(String(v), allowString);
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
		return jsonStrLike(String(value), allowString) as unknown as T;
	}
	return null;
}
