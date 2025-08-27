import { isStr } from './isStr';

export function isStrBool(value: unknown): value is string {
	if (!isStr(value)) {
		return false;
	}
	const normalized = value.trim().toLowerCase();
	
	return normalized === 'true' || normalized === 'false';
}
