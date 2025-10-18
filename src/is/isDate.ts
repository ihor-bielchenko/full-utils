import { isStr } from './isStr';
import { isNum } from './isNum';

/**
 * Checks whether a value represents a **valid JavaScript date**.
 *
 * @summary
 * Returns `true` if the given value is either:
 * - an actual `Date` instance with a valid timestamp, or
 * - a string or number that can be successfully parsed by the JavaScript `Date` constructor.
 *
 * Returns `false` for invalid dates (`Invalid Date`), empty strings, `NaN`, or non-date types.
 *
 * @param value - Any value to test (can be a `Date`, string, number, or other type).
 *
 * @returns `true` if the value can be interpreted as a valid date, otherwise `false`.
 *
 * @remarks
 * ### Validation logic
 * 1. **If `value` is a `Date` instance:**  
 *    Checks `!Number.isNaN(value.getTime())` — ensures it’s a real date, not an invalid one.
 *    ```ts
 *    isDate(new Date('invalid')); // false
 *    ```
 *
 * 2. **If `value` is a string or number:**  
 *    Attempts to construct a new `Date(value)`.  
 *    Returns `true` only if the resulting date’s timestamp is finite (not `NaN`).
 *
 * 3. **Otherwise:**  
 *    Returns `false`.
 *
 * ### What counts as "valid"
 * - OK: `"2024-12-31"`, `"2024-12-31T23:59:59Z"`, `1728000000000`, `new Date()`
 * - BAD: `"abc"`, `NaN`, `{}`, `null`, `undefined`, `new Date('invalid')`
 *
 * ### Type safety
 * - This is **not** a strict type guard (it doesn’t narrow to `Date`),  
 *   but you can pair it with a cast when `true`:
 *   ```ts
 *   if (isDate(v)) {
 *     const d = new Date(v); // guaranteed valid
 *   }
 *   ```
 *
 * ### Performance
 * - Time complexity: **O(1)**  
 *   (`Date` construction and timestamp check are constant-time operations).
 * - Space complexity: **O(1)**.
 *
 * ### Examples
 *
 * @example
 * // Valid Date instances
 * isDate(new Date());                  // => true
 * isDate(new Date('2024-05-01'));      // => true
 *
 * @example
 * // From strings or timestamps
 * isDate('2025-01-01T00:00:00Z');      // => true
 * isDate(1700000000000);               // => true
 * isDate('not-a-date');                // => false
 *
 * @example
 * // Invalid cases
 * isDate({});                          // => false
 * isDate([]);                          // => false
 * isDate('');                          // => false
 * isDate(new Date('invalid'));         // => false
 *
 * @see isStr
 * @see isNum
 * @see Date
 *
 * @category Type Guards
 * @public
 * @since 1.0.0
 */
export function isDate(value: unknown): boolean {
	if (value instanceof Date) {
		return !Number.isNaN(value.getTime());
	}
	if (isStr(value) || isNum(value)) {
		const d = new Date(value as any);

		return !Number.isNaN(d.getTime());
	}
	return false;
}
