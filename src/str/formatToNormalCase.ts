import { 
	isStrFilled,
	isStr,
	formatToLowerCase, 
} from '../index';

export function formatToNormalCase(value?: unknown): string {
	if (!isStr(value)) {
		return '';
	}
	const parsed = formatToLowerCase(value);
	
	return isStrFilled(parsed) ? (parsed[0].toUpperCase() + parsed.slice(1)) : '';
}
