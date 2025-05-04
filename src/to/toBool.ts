import { isStrFilled } from '../is/isStrFilled';

export function toBool(value): boolean {
	if (isStrFilled(value)) {
		const valueProcessed = value.trim().toLowerCase();

		if (valueProcessed === 'true') {
			return true;
		}
		else if (valueProcessed === 'false') {
			return false;
		}
	}
	else if (value === 1) {
		return true;
	}
	else if (value === 0) {
		return false;
	}
	throw new Error(`Value ${String(value)} is bad format.`);
}
