
export function isNum(value): boolean {
	return typeof value !== 'boolean' 
		&& typeof value !== 'object'
		&& (Number(value) >= 0 || Number(value) < 0);
}
