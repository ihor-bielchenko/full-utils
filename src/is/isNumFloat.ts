import { isNum } from './isNum';

export function isNumFloat(value: unknown): value is number {
	return isNum(value) && !Number.isInteger(value);
}
