import { isStrFilled } from '../index';

export function isStrBool(value: unknown): value is string {
	if (!isStrFilled(value)) {
		return false;
	}
	const normalized = value.trim().toLowerCase();
	
	return normalized === 'true' || normalized === 'false';
}
