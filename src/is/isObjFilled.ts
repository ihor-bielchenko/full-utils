import { isObj } from '../index';

export function isObjFilled(value: unknown): value is Record<string, unknown> {
	return isObj(value) && Object.keys(value).length > 0;
}
