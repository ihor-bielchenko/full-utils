import { isStr } from './isStr';
import { isNum } from './isNum';

export function isDate(value): boolean {
	if (isStr(value) || isNum(value)) {
		const valueProcessed = new Date(value);

		return (valueProcessed instanceof Date && !Number.isNaN(valueProcessed));
	}
	return false;
}

