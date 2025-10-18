import type { RangeIPv4Options } from './types';
import { rangeIPv4 } from './rangeIPv4';

/**
 * Materializes an IPv4 range into an array of dotted-quad strings.
 *
 * @remarks
 * This is a convenience wrapper around the lazy {@link rangeIPv4} generator that
 * collects the yielded addresses into a new array. To protect against excessive
 * memory usage, a hard {@link RangeIPv4Options.limit | limit} is enforced
 * (default `1_000_000`). If the range exceeds the limit, an error is thrown and
 * **no** partial array is returned.
 *
 * Prefer using the generator for very large ranges, streaming the results into
 * your processing pipeline (e.g. writing to a file or socket).
 *
 * @param from - See {@link rangeIPv4} for accepted forms (CIDR or IPv4).
 * @param to - Optional end address (non-CIDR mode). Ignored for CIDR input.
 * @param opts - Options including the array size `limit`. See {@link RangeIPv4Options}.
 * @returns A new array with all IPv4 addresses in the range (inclusive).
 *
 * @example
 * ```ts
 * // Small range OK
 * rangeIPv4ToArray('192.168.1.10', '192.168.1.13');
 * // -> ['192.168.1.10','192.168.1.11','192.168.1.12','192.168.1.13']
 *
 * // Will throw if exceeds the limit
 * rangeIPv4ToArray('10.0.0.0/16', undefined, { limit: 10_000 }); // Error
 * ```
 *
 * @throws {Error} If the realized array would exceed `opts.limit`.
 * @see {@link rangeIPv4} for lazy iteration without materialization.
 * @public
 * @category IPv4
 * @since 2.0.0
 */
export function rangeIPv4ToArr(
	from: string,
	to?: string,
	opts: RangeIPv4Options = {}
): string[] {
	const { limit = 1_000_000 } = opts;
	const out: string[] = [];
	let count = 0;

	for (const ip of rangeIPv4(from, to, opts)) {
		if (count >= limit) {
			throw new Error(`Range is too large (> ${limit}). Use the generator version instead.`);
		}
		out.push(ip);
		count++;
	}
	return out;
}
