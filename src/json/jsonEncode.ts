import { 
	isObj,
	isArr, 
	jsonDecode,
} from '../index';

/**
 * Safely serializes a plain object or array into a JSON string.
 *
 * @remarks
 * This helper wraps {@link JSON.stringify} and adds two key safety features:
 *
 * 1. It only serializes **objects** and **arrays**, ignoring all other data types
 *    (numbers, strings, booleans, `null`, `undefined`).
 * 2. It catches all potential `JSON.stringify` errors (such as circular references)
 *    and returns an empty string `""` instead of throwing.
 *
 * The function is thus ideal for safe logging, diagnostics, or best-effort
 * serialization where throwing is undesirable.
 * 
 * - The output is always a valid JSON string (or empty string on failure).
 * - Use {@link jsonDecode} to reverse the process and safely parse it back.
 * - BigInt values are **not supported** by `JSON.stringify` — they will trigger
 *   a caught error, resulting in an empty string.
 *
 * @param value - Any value to encode. Only arrays or plain objects will be serialized;
 *                other types return an empty string.
 *
 * @returns The JSON-encoded string representation of the input,  
 * or an empty string (`""`) if:
 * - The input is not an array or object.
 * - Serialization fails (e.g., circular reference or BigInt values).
 *
 * @example
 * ```ts
 * // Example 1: Basic usage
 * jsonEncode({ a: 1, b: true });
 * // -> '{"a":1,"b":true}'
 *
 * // Example 2: Arrays
 * jsonEncode([1, 2, 3]);
 * // -> '[1,2,3]'
 *
 * // Example 3: Non-serializable input
 * jsonEncode(123);        // -> ''
 * jsonEncode('hello');    // -> ''
 * jsonEncode(undefined);  // -> ''
 *
 * // Example 4: Circular reference
 * const obj: any = {};
 * obj.self = obj;
 * jsonEncode(obj); // -> '' (fails safely)
 * ```
 *
 * @throws Never throws — all exceptions from `JSON.stringify` are caught internally.
 *
 * @see {@link jsonDecode} — performs the inverse operation with safe parsing and normalization.
 * @see {@link JSON.stringify} — the native method used under the hood.
 *
 * @public
 * @category JSON
 * @since 2.0.0
 */
export function jsonEncode(value: unknown): string {
	try {
		return (isObj(value) || isArr(value)) ? JSON.stringify(value) : '';
	}
	catch (err) {
	}
	return '';
}
