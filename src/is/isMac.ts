import { isStr } from './isStr';

export function isMac(value): boolean {
	return isStr(value)
		&& /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/.test(value);
}
