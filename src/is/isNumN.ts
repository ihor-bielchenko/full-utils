import { isNum } from './isNum';

export function isNumN(value: unknown): value is number {
	return isNum(value) && value < 0;
}
