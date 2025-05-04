import { isNum } from '../is/isNum';
import { toNum } from './toNum';

export function toGB(value: any, unit = ''): number {
	const unitLowerCase = unit.trim().toLowerCase();
	const valueProcessed = toNum(value);
	let output = 0;

	switch (unitLowerCase[0]) {
		case 'b':
			output = valueProcessed / (1024 * 1024 * 1024);
		case 'k':
			output = valueProcessed / (1024 * 1024);
		case 'm':
			output = valueProcessed / 1024;
		case 't':
			output = valueProcessed * 1000;
		case 'p':
			output = valueProcessed * 1000000;
		default:
			output = valueProcessed;
			break;
	}
	if (!isNum(output)) {
		throw new Error(`In "toGB" function value "${valueProcessed}" with init "${unit}" in not valid.`);
	}
	return toNum(output);
}