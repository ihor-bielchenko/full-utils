
export function toPortions(value: Array<any>, portionLength: number, output: Array<Array<any>> = []): Array<Array<any>> {
	const portion = value.splice(0, portionLength);

	if (portion.length > 0) {
		output.push(portion);
	}
	if (value.length > 0) {
		return toPortions([ ...value ], portionLength, output);
	}
	return output;
}
