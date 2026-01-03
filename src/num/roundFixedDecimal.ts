import type { FixedDecimal } from './types';

export function roundFixedDecimal(
	source: FixedDecimal,
	decimalPlaces: number,
	roundMode: 'half-up' | 'trunc' = 'half-up'
): FixedDecimal {
	const targetPrecision = Math.max(0, Math.trunc(decimalPlaces));

	if (source.scale <= targetPrecision) {
		return { ...source };
	}
	const digitsToRemove = source.scale - targetPrecision;
	const divisionFactor = 10n ** BigInt(digitsToRemove);
	const integerPart = source.digitsInteger / divisionFactor;
	const remainder = source.digitsInteger % divisionFactor;

	if (roundMode === 'trunc' || remainder === 0n) {
		return { 
			sign: source.sign, 
			digitsInteger: integerPart, 
			scale: targetPrecision, 
		};
	}
	const halfThreshold = divisionFactor / 2n;
	const shouldRoundUp = remainder >= halfThreshold;
	const roundedValue = shouldRoundUp ? integerPart + 1n : integerPart;
	
	return { 
		sign: source.sign, 
		digitsInteger: roundedValue, 
		scale: targetPrecision, 
	};
}