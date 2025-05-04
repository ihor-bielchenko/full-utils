import { isStr } from './isStr';

export function isStrBool(value): boolean {
	if (isStr(value)) {
		const valueProcessed = value.trim().toLowerCase();

		if (valueProcessed === 'true'
			|| valueProcessed === 'false') {
			return true;
		}
	}
	return false;
}
