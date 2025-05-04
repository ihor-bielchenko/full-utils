import { isNum } from './isNum';

export function isNumFloat(value): boolean {
	return isNum(value) && String(value).includes(`.`);
}
