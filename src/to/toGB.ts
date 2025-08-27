import { isNum } from '../is/isNum';
import { toNum } from './toNum';

const KB = 1024;
const MB = KB * 1024;
const GB = MB * 1024;
const TB = GB * 1024;
const PB = TB * 1024;

export function toGB(value: unknown, unit = ''): number {
	const v = toNum(value as any);
	
	if (!isNum(v)) {
		throw new Error(`toGB: value "${value}" is not numeric`);
	}
	const u = String(unit).trim().toLowerCase().replace(/\s+/g, '');
	const c = u ? u[0] : 'g';
	let out: number;
	
	switch (c) {
		case 'b':
			out = v / GB;
			break;
		case 'k':
			out = v / MB;
			break;
		case 'm':
			out = v / GB;
			break;
		case 'g':
			out = v;
			break;
		case 't':
			out = v * (TB / GB);
			break;
		case 'p':
			out = v * (PB / GB);
			break;
		default:
			out = v;
			break;
	}
	if (!isNum(out)) {
		throw new Error(`toGB: result is not finite (value="${value}", unit="${unit}")`);
	}
	return Object.is(out, -0) ? 0 : out;
}
