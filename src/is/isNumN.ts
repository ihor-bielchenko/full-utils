import { isNum } from './isNum';

export function isNumN(value): boolean {
	return isNum(value) && Number(value) < 0;
}
