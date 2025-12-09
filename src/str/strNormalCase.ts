import { 
	isStrFilled,
	isStr,
	strLowerCase, 
} from '../index';

export function strNormalCase(value?: unknown): string {
	if (!isStr(value)) {
		return '';
	}
	const parsed = strLowerCase(value);
	
	return isStrFilled(parsed) ? (parsed[0].toUpperCase() + parsed.slice(1)) : '';
}
