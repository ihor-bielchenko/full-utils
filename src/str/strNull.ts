import { 
	isStr,
	strTrim,
	strUndefined, 
} from '../index';

/**
 * Converts `undefined` or empty (whitespace-only) strings into `null`.
 *
 * @summary
 * Safely normalizes optional values by replacing both `undefined` and blank strings
 * with `null`, while preserving all other values as-is.  
 * This helps unify "missing" or "empty" values under a single, database-friendly
 * `null` representation.
 *
 * @param value - Any input value that may be a string, `undefined`, or another type.
 *
 * @returns
 * - `null` if:
 *   - The input is `undefined`, or
 *   - The input is a string that becomes empty after trimming (using {@link strTrim}).
 * - Otherwise returns the original `value`.
 *
 * @remarks
 * ### Processing steps
 * 1. If `value` is `undefined`, returns `null`.
 * 2. If `value` is a string:
 *    - Trims it with {@link strTrim}, removing whitespace and invisible characters.
 *    - If the trimmed result is empty (`''`), returns `null`.
 * 3. Otherwise returns the original value unchanged.
 *
 * ### Behavior notes
 * - Non-string, defined values (like `0`, `false`, `{}`, `[]`) are **not modified**.
 * - The function is **pure** (non-mutating) and safe for use in JSON or ORM normalization.
 * - Often used to prepare form data, REST payloads, or DB entities for consistent nullability.
 *
 * ### Comparison with {@link strUndefined}
 * | Case | `strNull` | `strUndefined` |
 * |------|----------------|----------------------|
 * | `undefined` | `null` | `undefined` |
 * | `''` (empty string) | `null` | `undefined` |
 * | `'text'` | `'text'` | `'text'` |
 * | non-string (e.g. `0`) | `0` | `0` |
 *
 * ### Use cases
 * - Unifying “empty” form values before DB insertion (`''` or `undefined` → `null`)
 * - Sanitizing request bodies before persistence or validation
 * - Preventing inconsistent null/undefined states across backend and frontend layers
 *
 * ### Performance
 * - Time complexity: **O(n)** (depends on string length)
 * - Space complexity: **O(n)** (creates a trimmed string copy)
 *
 * ### Examples
 *
 * @example
 * // Empty and whitespace strings
 * strNull('');          // => null
 * strNull('   ');       // => null
 *
 * @example
 * // Undefined also becomes null
 * strNull(undefined);   // => null
 *
 * @example
 * // Non-empty strings remain as-is
 * strNull('Hello');     // => "Hello"
 * strNull('  Data ');   // => "  Data "
 *
 * @example
 * // Non-string types are preserved
 * strNull(0);           // => 0
 * strNull(false);       // => false
 * strNull([]);          // => []
 * strNull({});          // => {}
 *
 * @see isStr
 * @see strTrim
 * @see strUndefined
 *
 * @category String
 * @public
 * @since 2.0.0
 */
export function strNull(value: unknown) {
	return ((isStr(value) && strTrim(value) === '') || value === undefined) ? null : value;
}
