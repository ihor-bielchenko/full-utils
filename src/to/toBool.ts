import { isStrFilled } from '../is/isStrFilled';

export function toBool(value: unknown): boolean {
	if (typeof value === 'boolean') {
		return value;
	}
	if (typeof value === 'number') {
		if (value === 1) {
			return true;
		}
		if (value === 0) {
			return false;
		}
	}
	if (isStrFilled(value)) {
		const v = value.trim().toLowerCase();
		
		if (v === 'true' || v === '1' || v === 'yes') {
			return true;
		}
		if (v === 'false' || v === '0' || v === 'no') {
			return false;
		}
	}
	throw new Error(`toBool: cannot convert value "${String(value)}" to boolean`);
}
