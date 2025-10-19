import { isStrFilled } from '../index';

/**
 * Checks whether a given value is a string equal to **"asc"** or **"desc"** (case-insensitive).
 *
 * @summary
 * A strict type guard that validates sorting direction strings —  
 * `"asc"` (ascending) or `"desc"` (descending).  
 * Useful for validating API parameters, SQL sort directives, or UI sort controls.
 *
 * @param value - Any value to test.
 *
 * @returns `true` if the value is a non-empty string representing `"asc"` or `"desc"`, otherwise `false`.
 *
 * @remarks
 * ### Behavior
 * 1. Uses {@link isStrFilled} to ensure the value is a non-empty string.
 * 2. Trims whitespace and converts it to lowercase.
 * 3. Returns `true` only if the normalized value equals `"asc"` or `"desc"`.
 * 4. Returns `false` for empty strings, other words, or non-string types.
 *
 * ### Type narrowing
 * When this function returns `true`, TypeScript infers:
 * ```ts
 * value is 'asc' | 'desc'
 * ```
 * which is ideal for type-safe sort order handling in functions and APIs.
 *
 * ### Performance
 * - Time complexity: **O(1)** (fixed length checks)
 * - Space complexity: **O(1)**
 *
 * ### Examples
 *
 * @example
 * // Valid inputs
 * isStrAscDesc('asc');     // => true
 * isStrAscDesc('DESC');    // => true
 * isStrAscDesc(' Asc ');   // => true
 *
 * @example
 * // Invalid inputs
 * isStrAscDesc('ascending'); // => false
 * isStrAscDesc('');          // => false
 * isStrAscDesc(null);        // => false
 * isStrAscDesc('up');        // => false
 *
 * @example
 * // Type narrowing in use
 * function sortData(order: unknown) {
 *   if (isStrAscDesc(order)) {
 *     console.log(`Sorting in ${order} order`);
 *   } else {
 *     console.log('Invalid sort direction');
 *   }
 * }
 *
 * @see isStr
 * @see isStrFilled
 *
 * @category Validation
 * @public
 * @since 2.0.0
 */
export function isStrAscDesc(value: unknown): value is 'asc' | 'desc' {
	if (!isStrFilled(value)) {
		return false;
	}
	const normalized = value.trim().toLowerCase();
	
	return normalized === 'asc' || normalized === 'desc';
}
