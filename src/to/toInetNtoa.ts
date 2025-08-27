
export function toInetNtoa(num: number): string {
	const nbuffer = new ArrayBuffer(4);
	const ndv = new DataView(nbuffer);

	ndv.setUint32(0, num, false);

	const output: number[] = [];
	let i = 0;
	
	while (i < 4) {
		output.push(ndv.getUint8(i));
		i++;
	}
	return output.join('.');
}
