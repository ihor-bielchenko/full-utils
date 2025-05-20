import { isStrBool } from '../is/isStrBool';
import { isBool } from '../is/isBool';
import { isNum } from '../is/isNum';
import { toBool } from './toBool';

export function toArrFuncArgs(value: string): Array<any> {
	if (value.startsWith(`[`) && value.endsWith(`]`)) {
		value = value.slice(1, -1);
	}
	const result = [];
	let buffer = ``,
		i = 0,
		depth = 0,
		inQuote = false,
		quoteChar = null;

	while (i < value.length) {
		const char = value[i];

		if (inQuote) {
			buffer += char;
				
			if (char === quoteChar && value[i - 1] !== `\\`) {
				inQuote = false;
			}
		} 
		else if (char === `'` || char === `"`) {
			inQuote = true;
			quoteChar = char;
			buffer += char;
		} 
		else if (char === `(`) {
			depth++;
			buffer += char;
		} 
		else if (char === `)`) {
			depth--;
			buffer += char;
		} 
		else if (char === `,` && depth === 0 && !inQuote) {
			result.push(buffer.trim());
			buffer = ``;
		} 
		else {
			buffer += char;
		}
		i++;
	}
	if (buffer.trim()) {
		result.push(buffer.trim());
	}
	return result.map((item) => {
		if (item.startsWith(`$`) && item.includes(`(`) && item.endsWith(`)`)) {
			return item;
		}
		if (isStrBool(item) || isBool(item)) {
			return toBool(item);
		}
		if (item === `null`) {
			return null;
		}
		if (isNum(item)) {
			return Number(item);
		}
		if ((item.startsWith(`'`) && item.endsWith(`'`)) 
			|| (item.startsWith(`"`) && item.endsWith(`"`))) {
			return item.slice(1, -1);
		}
		return item;
	});
}
