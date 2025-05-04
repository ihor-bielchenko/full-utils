import validator from 'validator';

export function isEmail(value): boolean {
	return validator.isEmail(value);
}


