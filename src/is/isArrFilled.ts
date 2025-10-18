import { isArr } from './isArr';


/**
 * Checks whether a value is a **non-empty array**.
 *
 * @summary
 * A strongly-typed type guard that returns `true` only if the input value is an array
 * (via {@link isArr}) and contains at least one element (`length > 0`).
 *  
 * Useful for narrowing unknown data to a **readonly non-empty tuple type**
 * (`readonly [T, ...T[]]`), which gives TypeScript safer access guarantees.
 *
 * @typeParam T - Expected element type of the array (defaults to `unknown`).
 *
 * @param value - Any value to test.
 *
 * @returns `true` if `value` is an array with at least one element; otherwise `false`.
 *
 * @remarks
 * ### Type narrowing
 * When this function returns `true`, TypeScript automatically infers that:
 * ```ts
 * value is readonly [T, ...T[]]
 * ```
 *  
 * That means inside the `if` block, you can safely access `value[0]`
 * without additional checks.
 *
 * ### Behavior
 * - Delegates the array check to {@link isArr}.
 * - Works with both mutable (`T[]`) and readonly arrays (`readonly T[]`).
 * - Does **not** mutate or clone the array.
 * - Returns `false` for:
 *   - Non-array values (`null`, `undefined`, `object`, `string`, etc.).
 *   - Empty arrays (`[]`).
 *
 * ### Performance
 * - Time complexity: **O(1)** (constant time check).
 * - Space complexity: **O(1)**.
 *
 * ### Examples
 *
 * @example
 * // Basic usage
 * isArrFilled([1, 2, 3]);  // => true
 * isArrFilled([]);          // => false
 *
 * @example
 * // With type inference
 * const maybeNumbers: unknown = [10, 20];
 * if (isArrFilled<number>(maybeNumbers)) {
 *   // value is now typed as: readonly [number, ...number[]]
 *   console.log(maybeNumbers[0]); // OK
 * }
 *
 * @example
 * // Non-array values
 * isArrFilled('abc');       // => false
 * isArrFilled(null);        // => false
 * isArrFilled(undefined);   // => false
 * isArrFilled({ length: 2 }); // => false
 *
 * @see isArr
 *
 * @category Type Guards
 * @public
 * @since 1.0.0
 */
export function isArrFilled<T = unknown>(value: unknown): value is readonly [ T, ...T[] ] {
	return isArr(value) && value.length > 0;
}
