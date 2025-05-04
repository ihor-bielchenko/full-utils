import { isNum } from '../is/isNum';
import { toNum } from './toNum';

export function toGH(value: any, unit = ''): number {
	const unitLowerCase = unit.trim().toLowerCase();
	const valueProcessed = toNum(value);
	let output = 0;

	switch (unitLowerCase[0]) {
		case 'h':
			output = valueProcessed / 1000000000;
			break;
		case 'k':
			output = valueProcessed / 1000000;
			break;
		case 'm':
			output = valueProcessed / 1000;
			break;
		case 't':
			output = valueProcessed * 1000;
			break;
		case 'p':
			output = valueProcessed * 1000000;
			break;
		case 'e':
			output = valueProcessed * 1000000000;
			break;
		default:
			output = valueProcessed;
			break;
	}
	if (!isNum(output)) {
		throw new Error(`In "toGH" function value "${valueProcessed}" with init "${unit}" in not valid.`);
	}
	return toNum(output);
}