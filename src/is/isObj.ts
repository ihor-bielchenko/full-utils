
export function isObj(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' 
		&& value !== null 
		&& Object.prototype.toString.call(value) === '[object Object]'
		&& !Array.isArray(value);
}
