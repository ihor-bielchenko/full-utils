import { isStr } from '../index';

export function strTrim(value: unknown, border: string = ''): string {
	const result = String(isStr(value) ? value.trim().normalize('NFKC').replace(/[\u200B-\u200D\uFEFF]/g, '') : '');

	if (border) {
		return result.split(border).filter((item) => !!item).join(border);
	}
	return result;
}
