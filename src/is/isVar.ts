import { isStr } from './isStr';

export function isVar(value): boolean {
	return isStr(value)
		&& /^[a-zA-Z0-9_]+$/.test(value) 
		&& !(Number(value[0]) >= 0
			|| Number(value[0]) < 0);
}

