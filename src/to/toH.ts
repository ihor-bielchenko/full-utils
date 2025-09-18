import { isNum } from '../is/isNum';
import { toNum } from './toNum';

function normalizeUnit(u: string): string {
	return String(u)
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '')
		.replace(/(?:\/?s|hash(?:es)?)$/i, '');
}

const FACTOR_H: Record<string, number> = {
	h: 1,
	k: 1e3,
	m: 1e6,
	g: 1e9,
	t: 1e12,
	p: 1e15,
	e: 1e18,
};

export function toH(value: any, unit = ''): number {
	const v = toNum(value);

	if (!isNum(v)) {
		return 0;
	}
	const u = normalizeUnit(unit);
	const c = u ? u[0] : 'h';
	const factor = FACTOR_H[c] ?? 1;
	const out = v * factor;

	if (!isNum(out)) {
		throw new Error(`toH: result is not finite (value="${v}", unit="${u}")`);
	}
	return Object.is(out, -0) ? 0 : out;
}
