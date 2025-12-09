import { 
	isNumP,
	ipStrNum, 
} from '../index';

/**
 * Converts a 32-bit unsigned integer (numeric IPv4 representation)
 * back into its dotted-decimal string form (e.g. `"192.168.0.1"`).
 *
 * @remarks
 * This is the inverse of {@link ipStrNum}.  
 * It interprets the input number as a **big-endian (network-byte-order)**
 * IPv4 value, extracting each of the four octets and joining them into
 * the standard dotted-quad notation.
 *
 * If the input is not a valid finite number (checked via {@link isNumP}),
 * an empty string `""` is returned instead of throwing an exception.
 *
 * The resulting string always consists of **exactly four decimal octets**
 * separated by dots, with each octet in the range `0–255`.
 * 
 * - Internally uses {@link DataView} to ensure consistent big-endian behavior
 *   across all platforms.
 * - The output format is always normalized (no leading zeros, no spaces).
 * - For the forward direction (string → number), see {@link ipStrNum}.
 *
 * @param num - The 32-bit unsigned integer representing an IPv4 address.
 *
 * @returns A dotted-decimal IPv4 string (e.g. `"10.0.0.1"`),  
 * or an empty string if the input is invalid.
 *
 * @example
 * ```ts
 * // Example 1: Basic conversion
 * ipNumStr(3232235521);
 * // -> "192.168.0.1"
 *
 * // Example 2: Edge values
 * ipNumStr(0);          // -> "0.0.0.0"
 * ipNumStr(4294967295); // -> "255.255.255.255"
 * ```
 *
 * @example
 * ```ts
 * // Example 3: Invalid inputs
 * ipNumStr(NaN);         // -> ""
 * ipNumStr(Infinity);    // -> ""
 * ipNumStr(-5);          // -> ""
 * ```
 *
 * @throws Never throws; invalid inputs simply return an empty string.
 *
 * @see {@link ipStrNum} — converts dotted IPv4 strings to numeric form.
 * @see {@link parseIPv4} — alternative parser using bitwise arithmetic.
 *
 * @public
 * @category Network & IP
 * @since 2.0.0
 */
export function ipNumStr(num: number): string {
	if (!isNumP(num)) {
		return '';
	}
	const nbuffer = new ArrayBuffer(4);
	const ndv = new DataView(nbuffer);

	ndv.setUint32(0, num, false);

	const output: number[] = [];
	let i = 0;
	
	while (i < 4) {
		output.push(ndv.getUint8(i));
		i++;
	}
	return output.join('.');
}
