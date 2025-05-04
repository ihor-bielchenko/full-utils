import { isNum } from './isNum';

export function isNumPZ(value): boolean {
	return isNum(value) && Number(value) >= 0;
}
