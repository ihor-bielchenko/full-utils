
export function arrSplitBatches<T>(arr: readonly T[], portionLength: number): T[][] {
	if (!Number.isInteger(portionLength) || portionLength <= 0) {
		return [];
	}
	const out: T[][] = [];
	let i = 0;
	
	while (i < arr.length) {
		out.push(arr.slice(i, i + portionLength));
		i += portionLength;
	}
	return out;
}
