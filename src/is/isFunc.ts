
export function isFunc<T extends Function = Function>(value: unknown): value is T {
	return typeof value === 'function';
}
