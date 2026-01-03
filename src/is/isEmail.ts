import { isStrFilled } from '../index';

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;

export function isEmail(value: unknown): value is string {
	if (!isStrFilled(value)) {
		return false;
	}
	return emailRegex.test(value);
}
