import { 
	isStr,
	strTrim, 
} from '../index';

export function parseIPv4(ip: string): number | null {
	if (!isStr(ip)) {
		return null;
	}
	const parts = strTrim(ip).split('.');
	
	if (parts.length !== 4) {
		return null;
	}
	let out = 0;
	
	for (let i = 0; i < 4; i++) {
		if (!/^\d{1,3}$/.test(parts[i])) {
			return null;
		}
		const n = Number(parts[i]);
		
		if (n < 0 || n > 255) {
			return null;
		}
		out = (out << 8) | n;
	}
	return out >>> 0;
}
