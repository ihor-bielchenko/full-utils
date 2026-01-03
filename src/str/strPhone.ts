import { 
	isStr,
	strTrim, 
} from '../index';

export function strPhone(value?: unknown, defaultCountry = '+7'): string | null {
	if (!isStr(value)) {
		return null;
	}
	let phone = strTrim(value).replace(/[\s\-().]/g, '');

	if (/^00\d{8,15}$/.test(phone)) {
		phone = '+' + phone.slice(2);
	}
	else if (/^\d{10}$/.test(phone)) {
		phone = defaultCountry + phone;
	}
	else if (/^\d{9,15}$/.test(phone) && !phone.startsWith('0')) {
		phone = '+' + phone;
	}
	return /^\+\d{10,15}$/.test(phone) ? phone : null;
}
