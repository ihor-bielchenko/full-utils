import { isNum } from '../index';

export function isNumFloat(value: unknown): value is number {
	return isNum(value) && !Number.isInteger(value);
}
