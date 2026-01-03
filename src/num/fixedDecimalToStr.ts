import type { FixedDecimal } from './types';

export function fixedDecimalToStr(value: FixedDecimal): string {
	const signSymbol = value.sign < 0 ? '-' : '';
	const allDigitsString = value.digitsInteger.toString();

	if (value.scale === 0) {
		return signSymbol + allDigitsString;
	}
	const padZeros = value.scale - allDigitsString.length;

	if (padZeros >= 0) {
		return signSymbol + '0.' + '0'.repeat(padZeros) + allDigitsString;
	}
	const integerBoundary = allDigitsString.length - value.scale;
	const integerText = allDigitsString.slice(0, integerBoundary);
	const fractionalText = allDigitsString.slice(integerBoundary);

	return signSymbol + integerText + '.' + fractionalText;
}
