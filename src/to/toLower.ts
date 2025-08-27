import { isStr } from '../is/isStr';

export function toLower(value?: unknown): string | null {
	if (!isStr(value)) {
		return null;
	}
	const trimmed = value.trim();
	
	return trimmed.length > 0 
		? trimmed.toLowerCase() 
		: null;
}
