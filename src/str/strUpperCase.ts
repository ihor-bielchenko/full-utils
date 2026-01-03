import { 
	isStrFilled,
	isStr,
	strTrim, 
} from '../index';

export function strUpperCase(value?: unknown): string {
	if (!isStr(value)) {
		return '';
	}
	const trimmed = strTrim(value);
	
	return isStrFilled(trimmed) ? trimmed.toUpperCase() : '';
}
