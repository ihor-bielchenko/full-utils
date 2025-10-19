
/**
 * Structural JSON-like type used throughout decoding.
 *
 * @remarks
 * This mirrors the standard JSON value domain:
 * `null`, booleans, numbers, strings, arrays of JSON-like values,
 * and plain object maps with string keys pointing to JSON-like values.
 *
 * @public
 * @category JSON
 * @since 2.0.0
 */
export type JSONLike =
	| null
	| boolean
	| number
	| string
	| JSONLike[]
	| { [k: string]: JSONLike };
