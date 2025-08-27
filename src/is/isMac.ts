import { isStr } from './isStr';

export function isMac(value: unknown): value is string {
	return isStr(value) && /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(value);
}
