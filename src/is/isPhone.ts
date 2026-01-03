import { 
	isStrFilled,
	isNum, 
} from '../index';

export function isPhone(value: unknown): value is string {
	if (!isStrFilled(value) 
		&& !isNum(value)) {
		return false;
	}
	const valueProcessed = String(value).trim();

	if (valueProcessed.startsWith('-')) {
		return false;
	}
	if ((valueProcessed.match(/\+/g) || []).length > 1) {
		return false;
	}
	if (valueProcessed.includes('+') && !valueProcessed.startsWith('+')) {
		return false;
	}
	if (!/^\+?[0-9-]+$/.test(valueProcessed)) {
		return false;
	}
	if (valueProcessed.length < 3 || valueProcessed.length > 20) {
		return false;
	}
	if (!/[0-9]$/.test(valueProcessed)) {
		return false;
	}
	if (valueProcessed.includes('--')) {
		return false;
	}
	return true;
}
