import { isArr } from '../index';

export function isArrFilled<T = unknown>(value: unknown): value is readonly [ T, ...T[] ] {
	return isArr(value) && value.length > 0;
}
