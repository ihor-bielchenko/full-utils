import { 
	isStr,
	formatToTrim, 
} from '../index';

/**
 * Parses a dotted-quad IPv4 string (e.g. `"192.168.0.1"`) into a 32-bit unsigned integer.
 *
 * @remarks
 * The returned number is in the range `0..0xFFFFFFFF` and represents the IPv4 address
 * in big-endian order (i.e. the usual network order).
 *
 * The function is strict about format:
 * - Exactly 4 decimal octets separated by dots.
 * - Each octet must be `0..255`.
 * - Only digits are allowed in each octet.
 *
 * Leading zeros in octets are permitted (e.g. `"001.002.003.004"`), but you may
 * choose to forbid them in a custom variant to avoid legacy octal confusions.
 *
 * @param ip - Dotted-quad IPv4 string to parse.
 * @returns The IPv4 as an unsigned 32-bit number, or `null` if invalid.
 *
 * @example
 * ```ts
 * parseIPv4('127.0.0.1'); // 2130706433
 * parseIPv4('256.0.0.1'); // null
 * parseIPv4('1.2.3');     // null
 * ```
 *
 * @public
 * @category IPv4
 * @since 2.0.0
 */
export function parseIPv4(ip: string): number | null {
	if (!isStr(ip)) {
		return null;
	}
	const parts = formatToTrim(ip).split('.');
	
	if (parts.length !== 4) {
		return null;
	}
	let out = 0;
	
	for (let i = 0; i < 4; i++) {
		if (!/^\d{1,3}$/.test(parts[i])) {
			return null;
		}
		const n = Number(parts[i]);
		
		if (n < 0 || n > 255) {
			return null;
		}
		out = (out << 8) | n;
	}
	return out >>> 0;
}
