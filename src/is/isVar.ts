import { isStr } from '../index';

export function isVar(value: unknown): value is string {
	return isStr(value) && /^[A-Za-z_][A-Za-z0-9_]*$/.test(value);
}
