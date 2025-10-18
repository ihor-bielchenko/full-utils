
/**
 * Checks whether a given value is a boolean (`true` or `false`).
 *
 * @summary
 * A strict type guard that returns `true` only if `value` is of type `"boolean"`.
 *  
 * This helps safely narrow unknown or mixed-type values in TypeScript code,
 * especially when working with dynamic data sources, JSON, or user input.
 *
 * @param value - Any value to check.
 *
 * @returns `true` if the value is strictly a boolean, otherwise `false`.
 *
 * @remarks
 * - Uses the built-in `typeof` operator (`typeof value === "boolean"`).  
 * - Does **not** coerce values — only primitive `true` or `false` are accepted.
 * - Returns `false` for Boolean objects created via `new Boolean()`, because those
 *   are of type `"object"`, not `"boolean"`.
 * - Designed as a **type guard**, so when it returns `true`, TypeScript will infer:
 *   ```ts
 *   value is boolean
 *   ```
 *
 * ### Performance
 * - Time complexity: **O(1)** (constant).
 * - Space complexity: **O(1)**.
 *
 * ### Examples
 *
 * @example
 * // Basic usage
 * isBool(true);        // => true
 * isBool(false);       // => true
 * isBool(0);           // => false
 * isBool('true');      // => false
 *
 * @example
 * // With type narrowing
 * const val: unknown = Math.random() > 0.5 ? true : 'yes';
 * if (isBool(val)) {
 *   // TypeScript now knows val: boolean
 *   console.log(val ? 'OK' : 'NO');
 * }
 *
 * @example
 * // Boolean object is not accepted
 * isBool(new Boolean(true)); // => false
 *
 * @category Type Guards
 * @public
 * @since 1.0.0
 */
export function isBool(value: unknown): value is boolean {
	return typeof value === 'boolean';
}
