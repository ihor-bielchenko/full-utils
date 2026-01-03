import type { RangeIPv4Options } from './types';
import { rangeIPv4 } from './rangeIPv4';

export function rangeIPv4ToArr(
	from: string,
	to?: string,
	opts: RangeIPv4Options = {}
): string[] {
	const { limit = 1_000_000 } = opts;
	const out: string[] = [];
	let count = 0;

	for (const ip of rangeIPv4(from, to, opts)) {
		if (count >= limit) {
			throw new Error(`Range is too large (> ${limit}). Use the generator version instead.`);
		}
		out.push(ip);
		count++;
	}
	return out;
}
