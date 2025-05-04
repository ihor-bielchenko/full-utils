import { isStr } from './isStr';

export function isPassword(
	value, 
	options: { 
		minLength: number; 
		maxLength: number; 
		offDigid?: boolean;
		pattern?: RegExp;
	} = { 
		minLength: 8, 
		maxLength: 100, 
		offDigid: false,
		pattern: /^[A-Za-zА-Яа-я0-9\s~!?@#$%^&*_+()\[\]{}><\\\/|"'.,:;-]+$/,
	}): boolean {
	return isStr(value)
		&& value.length >= options.minLength
		&& value.length <= options.maxLength
		&& value[0] !== ' '
		&& (options.offDigid
			? true
			: (value[value.length - 1] !== ' '))
		&& /\d/.test(value)
		&& options.pattern.test(value);
};
