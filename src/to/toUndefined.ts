import { isStr } from '../is/isStr';
import { toTrim } from './toTrim';

export function toUndefined(value: unknown) {
	return (isStr(value) && toTrim(value) === '')
		? undefined
		: value
}
