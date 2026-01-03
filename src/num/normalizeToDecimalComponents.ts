import { convertExponentialToParts } from './convertExponentialToParts';

export function normalizeToDecimalComponents(input: unknown): {
	sign: 1 | -1;
	integerPart: string;
	fractionalPart: string;
} {
	if (typeof input === 'bigint') {
		const sign: 1 | -1 = input < 0n ? -1 : 1;
		const absoluteValue = (input < 0n ? -input : input).toString();
		
		return { 
			sign, 
			integerPart: absoluteValue, 
			fractionalPart: '', 
		};
	}
	if (typeof input === 'number') {
		if (!Number.isFinite(input)) {
			throw new Error('Input number is not finite.');
		}
		const sign: 1 | -1 = input < 0 ? -1 : 1;
		const absoluteValue = Math.abs(input);
		const exponentialForm = absoluteValue.toExponential(30); // например "1.23456e-5"
		
		return convertExponentialToParts(sign, exponentialForm);
	}
	if (typeof input === 'string') {
		let processed = input.trim().replace(',', '.');
		
		if (!processed) {
			throw new Error('Input string is empty.');
		}
		let sign: 1 | -1 = 1;
		
		if (processed.startsWith('+') || processed.startsWith('-')) {
			sign = processed.startsWith('-') ? -1 : 1;
			processed = processed.slice(1);
		}
		if (/^[0-9]*\.?[0-9]*(e[+\-]?[0-9]+)?$/i.test(processed)) {
			if (/e/i.test(processed)) {
				return convertExponentialToParts(sign, processed);
			}
			const [ integerPart = '0', fractionalPart = '' ] = processed.split('.');
			
			return { 
				sign, 
				integerPart, 
				fractionalPart, 
			};
		}
		throw new Error('Invalid numeric string.');
	}
	throw new Error('Unsupported input type.');
}