import { parseIPv4 } from './parseIPv4';

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
