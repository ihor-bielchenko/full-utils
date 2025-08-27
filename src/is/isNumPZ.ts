import { isNum } from './isNum';

export function isNumPZ(value: unknown): value is number {
	return isNum(value) && value >= 0;
}
