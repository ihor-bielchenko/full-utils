import type { RangeIPv4Options } from './types';
import { cidrToRange } from './cidrToRange';
import { parseIPv4 } from './parseIPv4';
import { toIPv4 } from './toIPv4';
import { rangeIPv4ToArr } from './rangeIPv4ToArr';

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
