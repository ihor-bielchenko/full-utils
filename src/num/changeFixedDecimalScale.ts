import type { FixedDecimal } from './types';

export function changeFixedDecimalScale(value: FixedDecimal, scaleDelta: number): FixedDecimal {
	const delta = Math.trunc(scaleDelta);

	if (delta === 0) {
		return { ...value };
	}
	if (delta > 0) {
		return {
			sign: value.sign,
			digitsInteger: value.digitsInteger,
			scale: value.scale + delta,
		};
	}
	const multiplier = 10n ** BigInt(-delta);
	
	return {
		sign: value.sign,
		digitsInteger: value.digitsInteger * multiplier,
		scale: value.scale + delta,
	};
}
