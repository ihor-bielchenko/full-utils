/**
 * Checks whether a given value is a **plain object** (i.e. `{}`), not `null`, not an array, and not a class instance.
 *
 * @summary
 * A strict type guard that returns `true` only if the input is a plain object
 * created using an object literal (`{}`) or `Object.create(null)`.  
 * Excludes arrays, functions, `null`, and instances of custom classes.
 *
 * @param value - Any value to test.
 *
 * @returns `true` if the value is a non-null, non-array plain object; otherwise `false`.
 *
 * @remarks
 * ### Behavior
 * The check ensures all of the following:
 * 1. `typeof value === "object"` — confirms the value is object-like.
 * 2. `value !== null` — excludes `null`, since `typeof null === "object"`.
 * 3. `Object.prototype.toString.call(value) === "[object Object]"` — filters out built-ins like `Map`, `Set`, `Date`, etc.
 * 4. `!Array.isArray(value)` — ensures arrays are excluded.
 *
 * ### What counts as a "plain object"
 * `{}`, `{ a: 1 }`, `Object.create(null)`  
 * `[]`, `new Date()`, `new Map()`, `null`, class instances.
 *
 * ### Comparison with related concepts
 * | Example value           | Result | Explanation                      |
 * |--------------------------|---------|----------------------------------|
 * | `{}`                     | true | Plain object                     |
 * | `Object.create(null)`    | true | No prototype but still object     |
 * | `[]`                     | false | Array excluded                   |
 * | `null`                   | false | Explicitly filtered              |
 * | `new Date()`             | false | Built-in class instance          |
 * | `class A {}; new A()`    | false | Custom class instance            |
 *
 * ### Type narrowing
 * When this function returns `true`, TypeScript infers:
 * ```ts
 * value is Record<string, unknown>
 * ```
 * allowing safe property access and iteration.
 *
 * ### Performance
 * - Time complexity: **O(1)**
 * - Space complexity: **O(1)**
 *
 * ### Examples
 *
 * @example
 * // Plain objects
 * isObj({});                   // => true
 * isObj({ key: 'value' });     // => true
 * isObj(Object.create(null));  // => true
 *
 * @example
 * // Non-objects or special cases
 * isObj(null);                 // => false
 * isObj([]);                   // => false
 * isObj(new Date());           // => false
 * isObj(new Map());            // => false
 * isObj(() => {});             // => false
 *
 * @example
 * // Type narrowing
 * const val: unknown = { x: 1 };
 * if (isObj(val)) {
 *   console.log(val.x); // safe: val is Record<string, unknown>
 * }
 *
 * @category Type Guards
 * @public
 * @since 2.0.0
 */
export function isObj(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' 
		&& value !== null 
		&& Object.prototype.toString.call(value) === '[object Object]'
		&& !Array.isArray(value);
}
