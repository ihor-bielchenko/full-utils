import { isStr } from './isStr';

interface PasswordOptions {
	minLength?: number;
	maxLength?: number;
	requireUppercase?: boolean;
	requireLowercase?: boolean;
	requireDigit?: boolean;
	requireSpecial?: boolean;
}

export function isPassword(
	value: unknown,
	{
		minLength = 8,
		maxLength = 100,
		requireUppercase = true,
		requireLowercase = true,
		requireDigit = true,
		requireSpecial = true,
	}: PasswordOptions = {}
): value is string {
	if (!isStr(value)) {
		return false;
	}
	if (value.length < minLength || value.length > maxLength) {
		return false;
	}
	if (requireUppercase && !/[A-ZА-Я]/.test(value)) {
		return false;
	}
	if (requireLowercase && !/[a-zа-я]/.test(value)) {
		return false;
	}
	if (requireDigit && !/\d/.test(value)) {
		return false;
	}
	if (requireSpecial && !/[~!?@#$%^&*_\-+()\[\]{}><\\\/|"'.,:;=]/.test(value)) {
		return false;
	}
	return true;
}
