import { fixedDecimalToNum } from './fixedDecimalToNum';
import { parseToFixedDecimal } from './parseToFixedDecimal';
import { roundFixedDecimal } from './roundFixedDecimal';

export function numNormalize(value: unknown, round: number = 1, throwError: boolean = false): number {
	try {
		return fixedDecimalToNum((round > 1) ? roundFixedDecimal(parseToFixedDecimal(value), round, 'half-up') : parseToFixedDecimal(value));
	}
	catch (err: any) {
		if (throwError) {
			throw err;
		}
	}
	return 0;
}
