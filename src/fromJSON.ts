
export function fromJSON(value) {
	try {
		return JSON.parse(value);
	}
	catch (err) {
	}
	return null;
}
