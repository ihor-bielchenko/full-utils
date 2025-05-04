import { isNum } from './isNum';

export function isNumP(value): boolean {
	return isNum(value) && Number(value) > 0;
}
