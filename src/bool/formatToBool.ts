import { isBool } from '../is/isBool';
import { isNumP } from '../is/isNumP';
import { isNumNZ } from '../is/isNumNZ';
import { isStrFilled } from '../is/isStrFilled';

/**
 * Converts any given value into a normalized boolean (`true` / `false`).
 *
 * @summary
 * Performs **loose coercion** of different input types into a `boolean`
 * following predictable rules for numbers, strings, and actual boolean values.
 * Non-recognized values always return `false`.
 *
 * @param value - Any unknown input that should be interpreted as a boolean.
 *
 * @returns The normalized boolean result (`true` or `false`).
 *
 * @remarks
 * This function is designed to **gracefully handle** a wide variety of input forms —
 * including primitive values, numeric types, and user-typed strings (like `"yes"`, `"no"`, `"on"`, `"off"`).
 *
 * ### Conversion Rules (in order of precedence)
 * 1. **Native booleans** → returned as-is.
 *    - `true` → `true`
 *    - `false` → `false`
 *
 * 2. **Positive numbers** → interpreted as `true`.
 *    - `isNumP(value)` check passes (typically `> 0`).
 *    - Examples: `1`, `42`, `3.14` → `true`
 *
 * 3. **Zero or negative numbers** → interpreted as `false`.
 *    - `isNumNZ(value)` check passes (typically `<= 0`).
 *    - Examples: `0`, `-1` → `false`
 *
 * 4. **Truthy strings** → `"true"`, `"1"`, `"yes"`, `"on"` (case-insensitive)
 *    - `"TrUe"` → `true`
 *    - `"  YES  "` → `true`
 *
 * 5. **Falsy strings** → `"false"`, `"0"`, `"no"`, `"off"` (case-insensitive)
 *    - `"False"` → `false`
 *    - `" off "` → `false`
 *
 * 6. **Everything else** → `false`
 *    - `null`, `undefined`, `NaN`, empty string, symbols, objects, arrays, etc.
 *
 * ### String Handling
 * - Strings are **trimmed** and **lower-cased** before comparison.
 * - Case and whitespace are ignored.
 * - Empty strings (`""`) return `false`.
 *
 * ### Error Safety
 * - The function **never throws**.
 * - Non-primitive or unexpected types are handled safely and result in `false`.
 *
 * ### Performance
 * - Time complexity: **O(1)**.
 * - Space complexity: **O(1)**.
 *
 * ### Examples
 *
 * @example
 * // Native booleans
 * formatToBool(true);            // => true
 * formatToBool(false);           // => false
 *
 * @example
 * // Numeric values
 * formatToBool(1);               // => true
 * formatToBool(0);               // => false
 * formatToBool(-5);              // => false
 *
 * @example
 * // String values
 * formatToBool('yes');           // => true
 * formatToBool('No');            // => false
 * formatToBool('TRUE');          // => true
 * formatToBool('false');         // => false
 * formatToBool('on');            // => true
 * formatToBool('off');           // => false
 *
 * @example
 * // Mixed and invalid inputs
 * formatToBool(null);            // => false
 * formatToBool(undefined);       // => false
 * formatToBool([]);              // => false
 * formatToBool({});              // => false
 * formatToBool('maybe');         // => false
 *
 * @see isBool
 * @see isNumP
 * @see isNumNZ
 * @see isStrFilled
 *
 * @category Conversion
 * @public
 * @since 1.0.0
 */
export function formatToBool(value: unknown): boolean {
	switch (true) {
		case isBool(value):
			return value;

		case isNumP(value):
			return true;

		case isNumNZ(value):
			return false;

		case isStrFilled(value) && [ 'true', '1', 'yes', 'on' ].includes(String(value ?? '').trim().toLowerCase()):
			return true;

		case isStrFilled(value) && [ 'false', '0', 'no', 'off' ].includes(String(value ?? '').trim().toLowerCase()):
			return false;
	}
	return false;
}
