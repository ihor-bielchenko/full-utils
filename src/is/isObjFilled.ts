import { isObj } from './isObj';

export function isObjFilled(value): boolean {
	return isObj(value) && Object.keys(value).length > 0;
}
