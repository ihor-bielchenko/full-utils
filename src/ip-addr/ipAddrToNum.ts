
/**
 * Converts a dotted-decimal IPv4 address string (e.g. `"192.168.0.1"`)
 * into its **32-bit unsigned integer** representation.
 *
 * @remarks
 * This function performs a strict validation of the IPv4 address and encodes
 * each of its four octets into a 32-bit number using **big-endian (network byte order)**.
 *
 * The resulting number is in the range `0..4_294_967_295` (`0xFFFFFFFF`),
 * where:
 *
 * - `"0.0.0.0"` → `0`
 * - `"255.255.255.255"` → `4294967295`
 *
 * This representation is particularly useful for:
 * - performing numeric range comparisons (e.g., IP ranges, CIDR checks);
 * - storing IPv4 values compactly in binary structures or databases;
 * - bitwise operations such as masking and subnet arithmetic.
 *
 * @param ip - The IPv4 address in dotted-quad string form.
 *
 * @returns A 32-bit **unsigned integer** representing the given IPv4 address.
 *
 * @example
 * ```ts
 * // Example 1: Simple conversion
 * ipAddrToNum("192.168.0.1");
 * // -> 3232235521
 *
 * // Example 2: Edge values
 * ipAddrToNum("0.0.0.0");       // -> 0
 * ipAddrToNum("255.255.255.255"); // -> 4294967295
 * ```
 *
 * @example
 * ```ts
 * // Example 3: Invalid input
 * ipAddrToNum("192.168.1");      // throws Error("Invalid IPv4 address")
 * ipAddrToNum("256.0.0.1");      // throws Error("Invalid IPv4 address")
 * ipAddrToNum("abc.def.ghi.jkl"); // throws Error("Invalid IPv4 address")
 * ```
 *
 * @throws {Error}
 * Thrown when:
 * - The input does not contain exactly four parts separated by dots.
 * - Any octet is not an integer between 0 and 255 inclusive.
 *
 * @notes
 * - The conversion uses a {@link DataView} and explicit byte writes
 *   to guarantee consistent big-endian behavior across platforms.
 * - The output number is safe for 32-bit unsigned arithmetic via `>>> 0`.
 * - If you need the inverse operation, see {@link numToIpAddr}.
 *
 * @see {@link numToIpAddr} — converts a 32-bit integer back to an IPv4 string.
 * @see {@link parseIPv4} — similar numeric parser using bitwise operations.
 *
 * @public
 * @category Network & IP
 * @since 1.0.0
 */
export function ipAddrToNum(ip: string): number {
	const parts = ip.split('.').map(p => Number(p));

	if (parts.length !== 4 || parts.some(p => !Number.isInteger(p) || p < 0 || p > 255)) {
		throw new Error('Invalid IPv4 address');
	}

	const buffer = new ArrayBuffer(4);
	const dv = new DataView(buffer);
	let i = 0;

	while (i < 4) {
		dv.setUint8(i, parts[i]);
		i++;
	}
	return dv.getUint32(0, false);
}
