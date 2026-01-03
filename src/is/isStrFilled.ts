import { isStr } from '../index';

export function isStrFilled(value: unknown): value is string {
	return isStr(value) && value.trim().length > 0;
}
