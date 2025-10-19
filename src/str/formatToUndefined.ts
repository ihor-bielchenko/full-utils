import { 
	isStr,
	formatToTrim,
	formatToNull, 
} from '../index';

/**
 * Converts `null` or empty (whitespace-only) strings into `undefined`.
 *
 * @summary
 * Normalizes optional values by replacing both `null` and blank strings
 * with `undefined`, while keeping all other values unchanged.  
 * This is useful when preparing objects for APIs or serialization,
 * where `undefined` fields are automatically omitted or ignored.
 *
 * @param value - Any value that may be a string, `null`, or another type.
 *
 * @returns
 * - `undefined` if:
 *   - The value is `null`, or
 *   - The value is a string that becomes empty after trimming (via {@link formatToTrim}).
 * - Otherwise returns the original value.
 *
 * @remarks
 * ### Processing steps
 * 1. If `value` is `null`, return `undefined`.
 * 2. If `value` is a string:
 *    - Trim using {@link formatToTrim} to remove whitespace and invisible characters.
 *    - If trimmed result is empty, return `undefined`.
 * 3. Otherwise, return the original value unchanged.
 *
 * ### Behavior notes
 * - Non-string, non-null values (`0`, `false`, `{}`, `[]`, etc.) are **not modified**.
 * - The function is **non-mutating** — it never changes the original reference.
 * - It complements {@link formatToNull}, depending on whether your system
 *   prefers `undefined` (omit field) or `null` (explicit empty value).
 *
 * ### Comparison with {@link formatToNull}
 * | Case | `formatToNull` | `formatToUndefined` |
 * |------|----------------|----------------------|
 * | `null` | `null` | `undefined` |
 * | `undefined` | `null` | `undefined` |
 * | `''` (empty string) | `null` | `undefined` |
 * | `'text'` | `'text'` | `'text'` |
 * | Non-string (e.g. `0`) | `0` | `0` |
 *
 * ### Use cases
 * - Preparing data before sending to REST or GraphQL APIs  
 *   (so empty fields are omitted during JSON serialization)
 * - Cleaning form input values before saving or validation
 * - Ensuring `undefined` consistency in optional object properties
 *
 * ### Performance
 * - Time complexity: **O(n)** (depends on string length)
 * - Space complexity: **O(n)** (due to string trimming)
 *
 * ### Examples
 *
 * @example
 * // Empty and whitespace-only strings
 * formatToUndefined('');        // => undefined
 * formatToUndefined('   ');     // => undefined
 *
 * @example
 * // null is also normalized
 * formatToUndefined(null);      // => undefined
 *
 * @example
 * // Non-empty strings remain unchanged
 * formatToUndefined('Hello');   // => "Hello"
 *
 * @example
 * // Non-string types are preserved
 * formatToUndefined(0);         // => 0
 * formatToUndefined(false);     // => false
 * formatToUndefined([]);        // => []
 * formatToUndefined({});        // => {}
 *
 * @see isStr
 * @see formatToTrim
 * @see formatToNull
 *
 * @category String
 * @public
 * @since 2.0.0
 */
export function formatToUndefined(value: unknown) {
	return ((isStr(value) && formatToTrim(value) === '') || value === null) ? undefined : value
}
