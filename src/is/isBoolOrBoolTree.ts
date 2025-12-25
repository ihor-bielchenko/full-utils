import { isBool } from './isBool';
import { isObjFilled } from './isObjFilled';

export function isBoolOrBoolTree(value: unknown): boolean {
	if (isBool(value)) {
		return true;
	}
	if (!isObjFilled(value)) {
		return false;
	}
	for (const key of Object.keys(value)) {
		if (!isBoolOrBoolTree(value[key])) {
			return false;
		}
	}
	return true;
}
