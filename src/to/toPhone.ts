import { isStr } from '../is/isStr';

export function toPhone(value?: unknown): string | null {
	if (!isStr(value)) {
		return null;
	}
	let phone = value.trim().replace(/[\s\-().]/g, '');

	if (phone.startsWith('00')) {
		phone = '+' + phone.slice(2);
	}
	if (/^8\d{10}$/.test(phone)) {
		phone = '+7' + phone.slice(1);
	}
	if (/^\d{10}$/.test(phone)) {
		phone = '+7' + phone;
	}
	if (/^\+\d{10,15}$/.test(phone)) {
		return phone;
	}
	return null;
}
