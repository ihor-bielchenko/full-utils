import { 
	isObjFilled,
	isObj, 
	isArr,
	isFunc,
} from '../index';

type Primitive =
	| string
	| number
	| boolean
	| bigint
	| symbol
	| null
	| undefined;

function isObjFlat(value: unknown): value is Record<string, Primitive> {
	if (!isObjFilled(value)) {
		return false;
	}
	return Object.values(value).every((v) => v === null || (!isObj(v) && !isArr(v) || !isFunc(v)));
}
