import { 
	isBool,
	isNumP, 
	isNumNZ,
	isStrFilled,
} from '../index';

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
 * boolNormalize(true);            // => true
 * boolNormalize(false);           // => false
 *
 * @example
 * // Numeric values
 * boolNormalize(1);               // => true
 * boolNormalize(0);               // => false
 * boolNormalize(-5);              // => false
 *
 * @example
 * // String values
 * boolNormalize('yes');           // => true
 * boolNormalize('No');            // => false
 * boolNormalize('TRUE');          // => true
 * boolNormalize('false');         // => false
 * boolNormalize('on');            // => true
 * boolNormalize('off');           // => false
 *
 * @example
 * // Mixed and invalid inputs
 * boolNormalize(null);            // => false
 * boolNormalize(undefined);       // => false
 * boolNormalize([]);              // => false
 * boolNormalize({});              // => false
 * boolNormalize('maybe');         // => false
 *
 * @see isBool
 * @see isNumP
 * @see isNumNZ
 * @see isStrFilled
 *
 * @category Conversion
 * @public
 * @since 2.0.0
 */
export function boolNormalize(value: unknown): boolean {
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
