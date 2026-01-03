import { isStr } from '../index';

const IPV4_RE = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;

export function isIpAddr(value: unknown): value is string {
	if (!isStr(value)) {
		return false;
	}
	const v = value.trim();
	
	return IPV4_RE.test(v);
}
