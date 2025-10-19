import { 
	parseIPv4,
	toIPv4, 
} from '../index';

/**
 * Converts a CIDR block into its inclusive start/end IPv4 addresses.
 *
 * @remarks
 * The function validates the CIDR notation and returns a tuple of dotted-quad
 * IPv4 strings representing the first and last addresses in the block.
 * For `/0` the range spans the entire IPv4 address space. For `/32` the start
 * and end are the same single address.
 *
 * @param cidr - CIDR notation string, e.g. `"192.168.1.0/24"` or `"10.0.0.1/32"`.
 * @returns A tuple `[start, end]` in dotted-quad form, or `null` if input is invalid.
 *
 * @example
 * ```ts
 * cidrToRange('192.168.1.0/24'); // ['192.168.1.0','192.168.1.255']
 * cidrToRange('10.0.0.1/32');    // ['10.0.0.1','10.0.0.1']
 * cidrToRange('bad');            // null
 * ```
 *
 * @throws Never throws; returns `null` on invalid input.
 * @see {@link parseIPv4} to parse an IPv4 string to a 32-bit number.
 * @see {@link toIPv4} to convert a number back to dotted-quad.
 * @public
 * @category IPv4
 * @since 2.0.0
 */
export function cidrToRange(cidr: string): [ string, string ] | null {
	const [ ip, maskStr ] = cidr.split('/');
	const base = parseIPv4(ip);
	const mask = maskStr ? Number(maskStr) : NaN;

	if (base === null || !Number.isInteger(mask) || mask < 0 || mask > 32) {
		return null;
	}
	const netmask = mask === 0 ? 0 : (0xFFFFFFFF << (32 - mask)) >>> 0;
	const start = base & netmask;
	const end = start | (~netmask >>> 0);

	return [ toIPv4(start), toIPv4(end) ];
}
