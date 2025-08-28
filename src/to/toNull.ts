import { isStr } from '../is/isStr';
import { toTrim } from './toTrim';

export function toNull(value: unknown) {
	return (isStr(value) && toTrim(value) === '')
		? null
		: value
}
