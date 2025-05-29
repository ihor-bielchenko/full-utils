import { isStrFilled } from '../is/isStrFilled';

export function toPoolName(value: string = ``): string {
	if (!isStrFilled(value)) {
		return ``;
	}
	const splitByUrl = value.split(`://`);

	if (splitByUrl.length === 2 && isStrFilled(splitByUrl[1])) {
		value = splitByUrl[1].trim();
	}
	const splitByPort = value.split(`:`);

	if (splitByPort.length === 2 && isStrFilled(splitByPort[0])) {
		value = splitByPort[0];
	}
	return value.replace(/&#/g, ``);
}
