import { isArrFilled } from './is/isArrFilled';
import { isObjFilled } from './is/isObjFilled';
import { isStrFilled } from './is/isStrFilled';

export function fromJSON(value) {
	try {
		let key = ``,
			parsed: any = {};

		if (isArrFilled(value)) {
			parsed = [];

			Array
				.from(value)
				.forEach((item: any) => {
					parsed.push(JSON.parse(item));
				});
			return parsed;
		}
		else if (isObjFilled(value)) {
			for (key in value) {
				parsed[key] = JSON.parse(value[key]);
			}
			return parsed;
		}
		return JSON.parse(value);
	}
	catch (err) {
	}
	if (isStrFilled(value) 
		&& ((value[0] === `'`
			&& value[value.length - 1] === `'`)
		|| (value[0] === `"`
			&& value[value.length - 1] === `"`)
		|| (value[0] === '`'
			&& value[value.length - 1] === '`'))) {
		return value.slice(1).slice(0, value.length - 2);
	}
	return null;
}
