import { 
	isStr,
	strTrim,
	strUndefined, 
} from '../index';

export function strNull(value: unknown) {
	return ((isStr(value) && strTrim(value) === '') || value === undefined) ? null : value;
}
