import * as crypto from 'crypto';

export function randNumCode(length: number = 5): string {
	let i = 0,
		result = '';

	while (i < length) {
		result += String(crypto.randomInt(0, 10));
		i++;
	}
	return result;
}
