import { isObj } from '../is/isObj';
import { isArr } from '../is/isArr';

export function toJSON(value: unknown): string {
	try {
		return (isObj(value) || isArr(value)) ? JSON.stringify(value) : '';
	}
	catch (err) {
	}
	return '';
}
