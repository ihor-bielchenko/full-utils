import { isStr } from '../is/isStr';

export function toTrim(value: unknown) {
	return isStr(value) 
		? value.trim() 
		: value;	
}
