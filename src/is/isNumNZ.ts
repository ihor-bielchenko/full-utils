import { isNum } from '../index';

export function isNumNZ(value: unknown): value is number {
	return isNum(value) && value <= 0;
}
