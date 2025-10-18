import { isObj } from './isObj';

/**
 * Checks whether a given value is a **non-empty plain object**.
 *
 * @summary
 * A strict type guard that returns `true` only if the input is a plain object
 * (validated by {@link isObj}) **and** has at least one own enumerable key.  
 * In other words, it must be an object literal like `{ a: 1 }`, not `{}`.
 *
 * @param value - Any value to test.
 *
 * @returns `true` if the value is a plain object with at least one own property; otherwise `false`.
 *
 * @remarks
 * ### Behavior
 * - Uses {@link isObj} to verify the value is a plain object (not `null`, not an array, not a class instance).
 * - Calls `Object.keys(value).length > 0` to ensure the object has one or more keys.
 * - Returns `false` for empty objects (`{}`), arrays, functions, `null`, and other non-object types.
 *
 * ### Comparison with related checks
 * | Function         | Description                           | Example              |
 * |------------------|---------------------------------------|----------------------|
 * | `isObj`          | Checks if value is a plain object      | `{}` true / `[]` false |
 * | `isObjFilled`    | Checks if plain object is **non-empty** | `{a: 1}` true / `{}` false |
 * | `isArrFilled`    | Checks if array is non-empty           | `[1]` true / `[]` false |
 * | `isStrFilled`    | Checks if string is non-empty          | `'a'` true / `''` false |
 *
 * ### Type narrowing
 * When this function returns `true`, TypeScript infers:
 * ```ts
 * value is Record<string, unknown>
 * ```
 * allowing safe property access and iteration.
 *
 * ### Performance
 * - Time complexity: **O(n)** — proportional to the number of object keys.
 * - Space complexity: **O(1)**.
 *
 * ### Examples
 *
 * @example
 * // Non-empty plain objects
 * isObjFilled({ a: 1 });        // => true
 * isObjFilled({ key: null });   // => true
 * isObjFilled({ nested: {} });  // => true
 *
 * @example
 * // Empty or invalid objects
 * isObjFilled({});              // => false
 * isObjFilled([]);              // => false
 * isObjFilled(null);            // => false
 * isObjFilled(new Date());      // => false
 *
 * @example
 * // Type narrowing
 * const data: unknown = { x: 5 };
 * if (isObjFilled(data)) {
 *   console.log(Object.keys(data)); // safe
 * }
 *
 * @see isObj
 * @see isArrFilled
 * @see isStrFilled
 *
 * @category Type Guards
 * @public
 * @since 1.0.0
 */
export function isObjFilled(value: unknown): value is Record<string, unknown> {
	return isObj(value) && Object.keys(value).length > 0;
}
