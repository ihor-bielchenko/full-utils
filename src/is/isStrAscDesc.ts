import { isStrFilled } from '../index';

export function isStrAscDesc(value: unknown): value is 'asc' | 'desc' {
	if (!isStrFilled(value)) {
		return false;
	}
	const normalized = value.trim().toLowerCase();
	
	return normalized === 'asc' || normalized === 'desc';
}
