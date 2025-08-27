
export function toInetAton(ip: string): number {
	const parts = ip.split('.').map(p => Number(p));

	if (parts.length !== 4 || parts.some(p => !Number.isInteger(p) || p < 0 || p > 255)) {
		throw new Error('Invalid IPv4 address');
	}

	const buffer = new ArrayBuffer(4);
	const dv = new DataView(buffer);
	let i = 0;

	while (i < 4) {
		dv.setUint8(i, parts[i]);
		i++;
	}
	return dv.getUint32(0, false);
}
