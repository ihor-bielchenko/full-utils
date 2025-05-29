import { isStrFilled } from '../is/isStrFilled';
import { isNum } from '../is/isNum';

export function toNum(value, fixed = 2) {
	let valueSplit = [];

	if (isStrFilled(value)) {
		const valueProcessed = value.trim().replaceAll(`,`, `.`);

		if (valueProcessed) {
			valueSplit = valueProcessed.split(`.`);
		}
	}
	else if (isNum(value)) {
		valueSplit = String(value).split(`.`);
	}
	else if (value) {
		return 1;
	}
	if (valueSplit.length === 2) {
		let i = 0,
			fixedReady = 0,
			collector = ``,
			afterZero = false;

		while (i < valueSplit[1].length) {
			if (valueSplit[1][i] !== `0`) {
				afterZero = true;
				fixedReady += 1;
			}
			if (afterZero && fixedReady > fixed) {
				break;
			}
			collector += valueSplit[1][i];
			i++;
		}
		return Number.parseFloat(([ valueSplit[0], collector ]).join(`.`));
	}
	else if (valueSplit.length === 1) {
		return Number(valueSplit[0]);
	}
	return 0;
}
