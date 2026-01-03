
export function isArr<T = unknown>(value: unknown): value is readonly [T, ...T[]] {
	return Array.isArray(value);
}
