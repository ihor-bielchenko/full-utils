import { 
	isStr,
	strTrim,
	strNull, 
} from '../index';

export function strUndefined(value: unknown) {
	return ((isStr(value) && strTrim(value) === '') || value === null) ? undefined : value
}
