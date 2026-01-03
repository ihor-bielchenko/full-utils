import { isNum } from '../index';

export function isNumP(value: unknown): value is number {
	return isNum(value) && value > 0;
}
