import { isFunc } from './isFunc';

export function isClass(value: unknown): boolean {
	return isFunc(value) && /^class\s/.test(Function.prototype.toString.call(value));
}
