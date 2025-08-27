import validator from 'validator';
import { isStrFilled } from './isStrFilled';

export function isEmail(value: unknown): value is string {
	return isStrFilled(value) && validator.isEmail(value);
}
