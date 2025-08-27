import { isStr } from './isStr';

export function isStrFilled(value: unknown): value is string {
	return isStr(value) && value.trim().length > 0;
}
