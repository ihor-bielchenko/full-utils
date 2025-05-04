
export function toInetNtoa(num: number): string {
	const nbuffer = new ArrayBuffer(4);
	const ndv = new DataView(nbuffer);
	const output = [];
	let i = 0;
	
	ndv.setUint32(0, num);
	
	for(i = 0; i < 4; i++){
		output[i] = ndv.getUint8(i);
	}
	return output.join('.');
}
