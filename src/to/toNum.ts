import { isStrFilled } from '../is/isStrFilled';
import { isNum } from '../is/isNum';

const STRICT_RE = /^[+-]?(?:\d+|\d*\.\d+)$/;
const PARSE_RE  = /^([+-]?)(\d*)(?:\.(\d+))?$/;

export function toNum(value: unknown, fixed = 2, fallback = 0): number {
	if (!Number.isFinite(fixed) || fixed < 0) {
		fixed = 0;
	}
	fixed = Math.floor(fixed);
	
	let numStr: string | null = null;

	if (isNum(value)) {
		numStr = String(value);
	} 
	else if (isStrFilled(value)) {
		const raw = (value as string)
			.trim()
			.replace(/,/g, '.')
			.replace(/\s+/g, '');
		
		numStr = raw;
	}
	else {
		return fallback;
	}
	if (!STRICT_RE.test(numStr)) {
		return fallback;
	}
	const m = PARSE_RE.exec(numStr);
	
	if (!m) {
		return fallback;
	}
	let [ , sign, intPart, fracPart = '' ] = m;

	if (intPart === '') {
		intPart = '0';
	}
	fracPart = (fixed === 0)
		? ''
		: fracPart.slice(0, fixed);

	const normalized = sign + intPart + (fracPart ? '.' + fracPart : '');
	const out = Number(normalized);

	return Number.isFinite(out) 
		? (Object.is(out, -0) ? 0 : out) 
		: fallback;
}
