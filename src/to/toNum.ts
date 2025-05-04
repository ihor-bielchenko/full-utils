import { isStrFilled } from '../is/isStrFilled';
import { isNum } from '../is/isNum';

export function toNum(value, fixed: number = 2): number {
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

		while (i < valueSplit.length) {
			if (valueSplit[i] !== `0`) {
				afterZero = true;
				fixedReady += 1;
			}
			if (afterZero && fixedReady > fixed) {
				break;
			}
			collector += valueSplit[i];
			i++;
		}
		return Number.parseFloat(([ valueSplit[0], collector ]).join(`.`));
	}
	return 0;
}
