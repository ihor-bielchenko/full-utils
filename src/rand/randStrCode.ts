import * as crypto from 'crypto';

export function randStrCode(length: number = 24): string {
	return crypto.randomBytes(24).toString('hex');
}
