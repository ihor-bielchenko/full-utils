import { isObj } from './isObj';

export function isObjFilled(value: unknown): value is Record<string, unknown> {
	return isObj(value) && Object.keys(value).length > 0;
}
