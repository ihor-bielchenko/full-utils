import { isStrFilled } from '../index';

export function urlDecode(input: string): string {
	if (!isStrFilled(input)) {
		return String(input);
	}
	const RAW = '____RAW_PERCENT____';
	const pre = input.replace(/%(?![0-9A-Fa-f]{2})/g, RAW);
	const WHITELIST = new Set(['22', '7B', '7D', '3A', '2C', '5B', '5D', '5C']);
	const decoded = pre.replace(/%([0-9A-Fa-f]{2})/g, (_m, hh: string) => {
		const code = hh.toUpperCase();

		if (!WHITELIST.has(code)) {
			return `%${code}`;
		}
		return decodeURIComponent(`%${code}`);
	});
	return decoded.split(RAW).join('%');
}
