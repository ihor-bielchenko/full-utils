import { parseIPv4 } from './parseIPv4';
import { toIPv4 } from './toIPv4';

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
