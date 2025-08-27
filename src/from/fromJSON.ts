import { isArrFilled } from '../is/isArrFilled';
import { isArr } from '../is/isArr';
import { isObjFilled } from '../is/isObjFilled';
import { isObj } from '../is/isObj';
import { isStrFilled } from '../is/isStrFilled';
import { isNum } from '../is/isNum';
import { isBool } from '../is/isBool';

type JSONLike =
	| null
	| boolean
	| number
	| string
	| JSONLike[]
	| { [k: string]: JSONLike };

const QUOTED_RE = /^(['"`])([\s\S]*)\1$/;

function tryParseJSON(str: string): { ok: true; value: JSONLike } | { ok: false } {
	try {
		return { ok: true, value: JSON.parse(str) as JSONLike };
	} 
	catch (err) {
	}
	return { ok: false };
}

function parseStringLike(s: string, allowString: boolean): JSONLike | null {
	const trimmed = s.trim();
	const pr = tryParseJSON(trimmed);
	
	if (pr.ok) {
		return pr.value;
	}
	const m = QUOTED_RE.exec(trimmed);
	
	if (m) {
		return m[2] as JSONLike;
	}
	return allowString ? (trimmed as JSONLike) : null;
}

export function fromJSON<T = JSONLike>(value: unknown, allowString = false): T | null {
	if (value === null || isNum(value) || isBool(value)) {
		return value as unknown as T;
	}
	if (isArrFilled(value)) {
		const arr = value as ReadonlyArray<unknown>;
		const out: JSONLike[] = [];
		
		for (const item of arr) {
			if (isStrFilled(item)) {
				out.push(parseStringLike(String(item), allowString));
			}
			else {
				out.push(item as JSONLike);
			}
		}
		return out as unknown as T;
	}
	if (isObjFilled(value)) {
		const src = value as Record<string, unknown>;
		const out: Record<string, JSONLike> = {};
		
		for (const key of Object.keys(src)) {
			const v = src[key];
			
			if (isStrFilled(v)) {
				out[key] = parseStringLike(String(v), allowString);
			} 
			else {
				out[key] = v as JSONLike;
			}
		}
		return out as unknown as T;
	}
	if (isArr(value) || isObj(value)) {
		return value as unknown as T;
	}
	if (isStrFilled(value)) {
		return parseStringLike(String(value), allowString) as unknown as T;
	}
	return null;
}
