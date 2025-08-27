import { isNum } from '../is/isNum';
import { toNum } from './toNum';

function normalizeUnit(u: string): string {
	return String(u)
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '')
		.replace(/(?:\/?s|hash(?:es)?)$/i, '');
}

const FACTOR: Record<string, number> = {
	h: 1e-9,
	k: 1e-6,
	m: 1e-3,
	g: 1,
	t: 1e3,
	p: 1e6,
	e: 1e9,
};

export function toGH(value: any, unit = ''): number {
	const v = toNum(value);

	if (!isNum(v)) {
		return 0;
	}
	const u = normalizeUnit(unit);
	const c = u ? u[0] : 'g';
	const factor = FACTOR[c] ?? 1;
	const out = v * factor;

	if (!isNum(out)) {
		throw new Error(`toGH: result is not finite (value="${v}", unit="${u}")`);
	}
	return Object.is(out, -0) ? 0 : out;
}