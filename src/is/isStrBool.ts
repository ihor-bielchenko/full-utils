import { isStrFilled } from './isStrFilled';

/**
 * Checks whether a given value is a **string representation of a boolean** — `"true"` or `"false"`.
 *
 * @summary
 * A strict type guard that returns `true` if the input is a non-empty string
 * equal to `"true"` or `"false"` (case-insensitive, with whitespace ignored).  
 * Commonly used for validating query parameters, environment variables, or serialized booleans.
 *
 * @param value - Any value to test.
 *
 * @returns `true` if the value is a string `"true"` or `"false"` (ignoring case and whitespace), otherwise `false`.
 *
 * @remarks
 * ### Behavior
 * 1. Uses {@link isStrFilled} to ensure the input is a non-empty string.
 * 2. Trims whitespace and converts it to lowercase.
 * 3. Returns `true` only if the normalized string equals `"true"` or `"false"`.
 * 4. Returns `false` for other strings, numbers, or non-string types.
 *
 * ### Typical usage
 * This utility is helpful when you need to:
 * - Parse stringified boolean flags (`'true'`, `'false'`)
 * - Validate configuration or query params
 * - Handle environment variables (`process.env.FEATURE_ENABLED`)
 *
 * ### Type narrowing
 * When this function returns `true`, TypeScript infers:
 * ```ts
 * value is string
 * ```
 * and you can safely pass it to a boolean converter (e.g. `formatToBool()`).
 *
 * ### Performance
 * - Time complexity: **O(1)**  
 * - Space complexity: **O(1)**
 *
 * ### Examples
 *
 * @example
 * // Valid boolean strings
 * isStrBool('true');        // => true
 * isStrBool('FALSE');       // => true
 * isStrBool(' True ');      // => true
 *
 * @example
 * // Invalid strings
 * isStrBool('yes');         // => false
 * isStrBool('0');           // => false
 * isStrBool('');            // => false
 *
 * @example
 * // Non-string inputs
 * isStrBool(true);          // => false
 * isStrBool(1);             // => false
 * isStrBool(null);          // => false
 *
 * @example
 * // Combined with formatToBool()
 * import { formatToBool } from '../bool/formatToBool';
 *
 * const val: unknown = 'False';
 * if (isStrBool(val)) {
 *   console.log(formatToBool(val)); // false
 * }
 *
 * @see isStr
 * @see isStrFilled
 * @see isBool
 * @see formatToBool
 *
 * @category Validation
 * @public
 * @since 1.0.0
 */
export function isStrBool(value: unknown): value is string {
	if (!isStrFilled(value)) {
		return false;
	}
	const normalized = value.trim().toLowerCase();
	
	return normalized === 'true' || normalized === 'false';
}
