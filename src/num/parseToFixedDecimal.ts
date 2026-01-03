import type { FixedDecimal } from './types';
import { normalizeToDecimalComponents } from './normalizeToDecimalComponents';

export function parseToFixedDecimal(input: unknown): FixedDecimal {
	const { 
		sign, 
		integerPart, 
		fractionalPart, 
	} = normalizeToDecimalComponents(input);
	const integerDigits = integerPart.replace(/^0+/, '') || '0';
	const fractionalDigits = fractionalPart.replace(/0+$/, '');
	const combinedDigits = (integerDigits + fractionalDigits) || '0';

	return {
		sign,
		digitsInteger: BigInt(combinedDigits),
		scale: fractionalDigits.length,
	};
}
