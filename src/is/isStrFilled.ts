import { isStr } from './isStr';

export function isStrFilled(value): boolean {
	return isStr(value) && value.length > 0;
}
