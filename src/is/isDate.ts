import { 
	isStr,
	isNum, 
} from '../index';

export function isDate(value: unknown): boolean {
	if (value instanceof Date) {
		return !Number.isNaN(value.getTime());
	}
	if (isStr(value) || isNum(value)) {
		const d = new Date(value as any);

		return !Number.isNaN(d.getTime());
	}
	return false;
}
