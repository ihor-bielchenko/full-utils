/**
 * Options that control how IPv4 ranges are iterated and materialized.
 *
 * @remarks
 * These options are primarily consumed by {@link rangeIPv4} and {@link rangeIPv4ToArray}.
 * They let you include/exclude the network and broadcast addresses when the input
 * is a CIDR block, and limit the maximum number of items when materializing to an array.
 *
 * @public
 * @category IPv4
 * @since 2.0.0
 */
export interface RangeIPv4Options {
	/**
	 * Hard cap on the number of elements to materialize into a returned array.
	 *
	 * @remarks
	 * This option is **only** consulted by {@link rangeIPv4ToArray}. It prevents
	 * accidentally allocating huge arrays when the supplied range is very large
	 * (e.g. `0.0.0.0/0` contains 4,294,967,296 addresses).
	 *
	 * If the computed range size exceeds this limit, an error will be thrown.
	 *
	 * @defaultValue `1_000_000`
	 * @example
	 * ```ts
	 * // Will throw because /16 has 65,536 addresses (> 10_000)
	 * rangeIPv4ToArray('10.0.0.0/16', undefined, { limit: 10_000 })
	 * ```
	 */
	limit?: number;
	
	/**
	 * Whether to include the *network* address when iterating a CIDR range.
	 *
	 * @remarks
	 * This flag is only applied when the input is a CIDR (e.g. `"192.168.0.0/24"`).
	 * For non-CIDR, ad-hoc ranges, network/broadcast semantics are not inferred.
	 *
	 * For `/31` and `/32` specifically, there is no distinct network/broadcast
	 * address to exclude, so this flag has no effect.
	 *
	 * @defaultValue `true`
	 * @example
	 * ```ts
	 * // Exclude 192.168.1.0 from a /24 network
	 * [...rangeIPv4('192.168.1.0/24', undefined, { includeNetwork: false })];
	 * ```
	 */
	includeNetwork?: boolean;
	
	/**
	 * Whether to include the *broadcast* address when iterating a CIDR range.
	 *
	 * @remarks
	 * This flag is only applied when the input is a CIDR (e.g. `"192.168.0.0/24"`).
	 * For `/31` and `/32`, there is no broadcast in the traditional sense,
	 * so this flag has no effect.
	 *
	 * @defaultValue `true`
	 * @example
	 * ```ts
	 * // Exclude 192.168.1.255 from a /24 network
	 * [...rangeIPv4('192.168.1.0/24', undefined, { includeBroadcast: false })];
	 * ```
	 */
	includeBroadcast?: boolean;
}
