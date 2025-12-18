import { isObjFilled } from './isObjFilled';
import { isObj } from './isObj';
import { isArr } from './isArr';
import { isFunc } from './isFunc';

type Primitive =
	| string
	| number
	| boolean
	| bigint
	| symbol
	| null
	| undefined;

export function isObjFlat(value: unknown): value is Record<string, Primitive> {
	if (!isObjFilled(value)) {
		return false;
	}
	return Object.values(value).every((v) => v === null || (!isObj(v) && !isArr(v) || !isFunc(v)));
}
