import { parseIPv4 } from './parseIPv4';

/**
 * Converts an unsigned 32-bit integer into a dotted-quad IPv4 string.
 *
 * @remarks
 * This is the inverse of {@link parseIPv4}. The function validates that the input
 * is a finite integer within `0..0xFFFFFFFF` and then formats it as `A.B.C.D`.
 *
 * @param n - Unsigned 32-bit IPv4 value (`0..0xFFFFFFFF`).
 * @returns A dotted-quad string such as `"192.168.0.1"`.
 *
 * @example
 * ```ts
 * toIPv4(0);            // "0.0.0.0"
 * toIPv4(0xFFFFFFFF);   // "255.255.255.255"
 * ```
 *
 * @throws {Error} If `n` is not an integer in `0..0xFFFFFFFF`.
 * @see {@link parseIPv4}
 * @public
 * @category IPv4
 * @since 2.0.0
 */
export function toIPv4(n: number): string {
	if (!Number.isInteger(n) || n < 0 || n > 0xFFFFFFFF) {
		throw new Error(`Invalid IPv4 number: ${n}`);
	}
	return [
		(n >>> 24) & 255,
		(n >>> 16) & 255,
		(n >>> 8) & 255,
		n & 255,
	].join('.');
}
