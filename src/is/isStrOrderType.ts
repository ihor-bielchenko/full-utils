import { isStrFilled } from './isStrFilled';

export function isStrOrderType(value: unknown): value is 'asc' | 'desc' {
	if (!isStrFilled(value)) {
		return false;
	}
	const normalized = value.trim().toLowerCase();
	
	return normalized === 'asc' || normalized === 'desc';
}
