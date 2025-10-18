
/**
 * Splits an input array into smaller subarrays (portions) of a given fixed size.
 *
 * @summary
 * Returns an array of chunks, where each chunk contains at most `portionLength` elements.
 * The final chunk may contain fewer elements if the input array length is not evenly divisible
 * by `portionLength`.
 *
 * @typeParam T - Type of the elements in the input array.
 *
 * @param arr - The source array to be split. It can be any readonly array (or tuple).
 * @param portionLength - The desired size of each portion. Must be a **positive integer**.
 *
 * @returns A new two-dimensional array (`T[][]`), where each inner array is one portion.
 * If `portionLength` is not a positive integer, an empty array is returned.
 *
 * @remarks
 * - This function is **non-mutating**: the original array is never modified.
 * - If `portionLength` exceeds the array length, the result will be a single chunk
 *   containing the entire array.
 * - If the input array is empty, the result is an empty array.
 * - Uses `Array.prototype.slice()` internally, so the returned chunks are **shallow copies**.
 *
 * ### Performance
 * - Time complexity: **O(n)** — each element is visited exactly once.
 * - Space complexity: **O(n)** — proportional to the total number of elements copied.
 * - For extremely large arrays (millions of elements), prefer a streaming approach
 *   if memory is a concern.
 *
 * ### Edge cases
 * - `portionLength <= 0` → returns `[]`.
 * - `portionLength` is not an integer (e.g. `2.5`, `NaN`) → returns `[]`.
 * - `arr.length === 0` → returns `[]`.
 * - Works correctly with frozen arrays and readonly tuples.
 *
 * @example
 * // Split an array into groups of 3
 * splitArrToPortions([1, 2, 3, 4, 5, 6, 7], 3);
 * // => [[1, 2, 3], [4, 5, 6], [7]]
 *
 * @example
 * // Portion length larger than array
 * splitArrToPortions(['a', 'b'], 5);
 * // => [['a', 'b']]
 *
 * @example
 * // Non-integer or invalid sizes
 * splitArrToPortions([1, 2, 3], 0);   // => []
 * splitArrToPortions([1, 2, 3], -2);  // => []
 * splitArrToPortions([1, 2, 3], NaN); // => []
 *
 * @example
 * // Works with readonly arrays
 * const input = [10, 20, 30, 40] as const;
 * const result = splitArrToPortions(input, 2);
 * // result: [[10, 20], [30, 40]]
 *
 * @category Array
 * @public
 * @since 1.0.0
 */
export function splitArrToPortions<T>(arr: readonly T[], portionLength: number): T[][] {
	if (!Number.isInteger(portionLength) || portionLength <= 0) {
		return [];
	}
	const out: T[][] = [];
	let i = 0;
	
	while (i < arr.length) {
		out.push(arr.slice(i, i + portionLength));
		i += portionLength;
	}
	return out;
}
