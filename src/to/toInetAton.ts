
export function toInetAton(ip: string): number {
	const ipSplit: Array<any> = ip.split('.');
	const buffer = new ArrayBuffer(4);
	const dv = new DataView(buffer);
	let i = 0;
	
	for(i = 0; i < 4; i++) {
		dv.setUint8(i, ipSplit[i]);
	}
	return(dv.getUint32(0));
}
