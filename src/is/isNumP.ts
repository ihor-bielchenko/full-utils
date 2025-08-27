import { isNum } from './isNum';

export function isNumP(value: unknown): value is number {
	return isNum(value) && value > 0;
}
