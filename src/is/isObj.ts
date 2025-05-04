
export function isObj(value): boolean {
	return value
		&& typeof value === 'object'
		&& !Array.isArray(value);
}
