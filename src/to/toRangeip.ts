
export function toRangeip(from: string, to: string): Array<string> {
	const output = [];
	let start = from.split('.').map(Number),
		end = to.split('.').map(Number);

	if (to) {
		end = to.split('.').map(Number);
	}
	else {
		end = [ from.split('.')[0], from.split('.')[1], 0, 255].map(Number);
	}
	for (let i = start[0]; i <= end[0]; i++) {
		for (let j = start[1]; j <= end[1]; j++) {
			for (let k = start[2]; k <= end[2]; k++) {
				for (let l = start[3]; l <= end[3]; l++) {
					output.push(`${i}.${j}.${k}.${l}`);
				}
			}
		}
	}
	return output;
}
