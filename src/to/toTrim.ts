import { isStr } from '../is/isStr';

export function toTrim(value: unknown) {
	return isStr(value) 
		? value.trim().normalize('NFKC').replace(/[\u200B-\u200D\uFEFF]/g, '') 
		: value;	
}
