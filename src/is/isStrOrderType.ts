import { isStrFilled } from './isStrFilled';

export function isStrOrderType(value): boolean {
	if (!isStrFilled(value)) {
		return false;
	}
	const valueProcessed = value.trim().toLowerCase();

	return valueProcessed === 'asc' || valueProcessed === 'desc';
}
