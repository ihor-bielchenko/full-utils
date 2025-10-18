import type { RangeIPv4Options } from './types';
import { cidrToRange } from './cidrToRange';
import { parseIPv4 } from './parseIPv4';
import { toIPv4 } from './toIPv4';

/**
 * Creates a lazy generator over an inclusive IPv4 range.
 *
 * @remarks
 * The function supports two input modes:
 *
 * 1. **CIDR mode** — when `from` contains a slash and `to` is `undefined`:
 *    ```ts
 *    for (const ip of rangeIPv4('192.168.1.0/30')) { ... }
 *    ```
 *    In this mode, {@link RangeIPv4Options.includeNetwork} and
 *    {@link RangeIPv4Options.includeBroadcast} are honored for masks `<= /30`.
 *    For `/31` and `/32` there is no traditional network/broadcast to exclude.
 *
 * 2. **Ad-hoc range mode** — when `from` is an IPv4 and `to` is either an IPv4
 *    or empty/omitted:
 *    - If `to` is provided, the range is `[min(from,to) .. max(from,to)]`.
 *    - If `to` is omitted or blank, the range spans to the end of the `/24`
 *      block: `A.B.C.D .. A.B.C.255`.
 *
 * The iteration is inclusive of both endpoints and is safe around the upper
 * bound: if the current value is `0xFFFFFFFF`, the generator yields it once and terminates.
 *
 * @overload
 * @param from - A CIDR string (e.g. `"10.0.0.0/8"`). If this overload is used, `to` must be `undefined`.
 * @returns A generator of dotted-quad IPv4 strings.
 *
 * @overload
 * @param from - Starting IPv4 address in dotted-quad form.
 * @param to - Optional ending IPv4 address in dotted-quad form. If omitted or empty, the range ends at `A.B.C.255`.
 * @param opts - Iteration options (see {@link RangeIPv4Options}).
 * @returns A generator of dotted-quad IPv4 strings.
 *
 * @param from - See overloads.
 * @param to - See overloads.
 * @param opts - See overloads.
 *
 * @example
 * ```ts
 * // 1) CIDR iteration (include all)
 * [...rangeIPv4('192.168.1.0/30')];
 * // -> ['192.168.1.0','192.168.1.1','192.168.1.2','192.168.1.3']
 *
 * // 2) CIDR iteration without network/broadcast
 * [...rangeIPv4('192.168.1.0/30', undefined, { includeNetwork: false, includeBroadcast: false })];
 * // -> ['192.168.1.1','192.168.1.2']
 *
 * // 3) Ad-hoc range (explicit end)
 * [...rangeIPv4('10.0.0.1', '10.0.0.4')];
 * // -> ['10.0.0.1','10.0.0.2','10.0.0.3','10.0.0.4']
 *
 * // 4) Single address ⇒ to end of /24
 * [...rangeIPv4('10.1.2.3')].at(-1); // '10.1.2.255'
 * ```
 *
 * @throws {Error}
 * - If `from` is not a valid IPv4 (in non-CIDR mode).
 * - If `to` is supplied and is not a valid IPv4 (in non-CIDR mode).
 * - If `from` is not a valid CIDR in CIDR mode.
 *
 * @performance
 * This is a lazy generator: it does **not** allocate the entire range up-front,
 * making it suitable for very large ranges (iterate/stream/process on the fly).
 * If you need a materialized array, consider {@link rangeIPv4ToArray} but mind its `limit`.
 *
 * @see {@link cidrToRange} to convert a CIDR to `[start,end]`.
 * @see {@link rangeIPv4ToArray} to materialize a range into an array with a safe limit.
 * @public
 * @category IPv4
 * @since 2.0.0
 */
function rangeIPv4(from: string, to?: string): Generator<string>;
function rangeIPv4(from: string, to: string | undefined, opts?: RangeIPv4Options): Generator<string>;

function* rangeIPv4(from: string, to?: string, opts: RangeIPv4Options = {}): Generator<string> {
	const { includeNetwork = true, includeBroadcast = true } = opts;
	let startNum: number;
	let endNum: number;
	let isCIDR = false;
	let cidrMask: number | null = null;

	if (to === undefined && from.includes('/')) {
		const range = cidrToRange(from);
		
		if (!range) {
			throw new Error(`Invalid CIDR: "${from}"`);
		}
		const [ startStr, endStr ] = range;
		const [ _, maskStr ] = from.split('/');
		
		cidrMask = Number(maskStr);
		startNum = parseIPv4(startStr)!;
		endNum = parseIPv4(endStr)!;
		isCIDR = true;
	} 
	else {
		const s = parseIPv4(from);
		
		if (s === null) {
			throw new Error(`Invalid IPv4: "${from}"`);
		}
		startNum = s;

		if (to && to.trim() !== '') {
			const e = parseIPv4(to);
			
			if (e === null) {
				throw new Error(`Invalid IPv4: "${to}"`);
			}
			endNum = e;
		} 
		else {
			const a = (startNum >>> 24) & 255;
			const b = (startNum >>> 16) & 255;
			const c = (startNum >>> 8) & 255;
			
			endNum = ((a << 24) | (b << 16) | (c << 8) | 255) >>> 0;
		}
	}
	if (startNum > endNum) {
		[ startNum, endNum ] = [ endNum, startNum ];
	}
	let skipNetworkAt = -1;
	let skipBroadcastAt = -1;
	
	if (isCIDR && cidrMask !== null) {
		if (cidrMask <= 30) {
			skipNetworkAt = startNum;
			skipBroadcastAt = endNum;
		}
	}
	for (let cur = startNum; cur <= endNum; cur = (cur + 1) >>> 0) {
		if (!includeNetwork && cur === skipNetworkAt) {
			if (cur === endNum) {
				break;
			}
			continue;
		}
		if (!includeBroadcast && cur === skipBroadcastAt) {
			if (cur === endNum) {
				break;
			}
			continue;
		}
		yield toIPv4(cur);
		
		if (cur === 0xFFFFFFFF) {
			break;
		}
	}
}

export { rangeIPv4 };
