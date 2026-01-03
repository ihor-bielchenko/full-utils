import { isNumPZ } from '../index';

export function convertExponentialToParts(
	sign: 1 | -1,
	exponentialString: string
): { sign: 1 | -1; integerPart: string; fractionalPart: string } {
	const match = /^([0-9]+)(?:\.([0-9]*))?e([+\-]?[0-9]+)$/i.exec(
		(() => {
			const [coefficient, exponentText] = exponentialString.split(/e/i);
			const [integerPart, fractionalPart = ''] = coefficient.split('.');
			const allDigits = integerPart.replace(/^0+/, '') + fractionalPart;
			const exponentValue = parseInt(exponentText, 10) - fractionalPart.length;
			
			return `${allDigits || '0'}e${exponentValue}`;
		})()
	);

	if (!match) {
		throw new Error('Failed to parse exponential notation.');
	}
	let allDigits = match[1];
	const exponent = parseInt(match[3], 10);

	if (isNumPZ(exponent)) {
		allDigits = allDigits + '0'.repeat(exponent);
		
		return { 
			sign, 
			integerPart: allDigits || '0', 
			fractionalPart: '', 
		};
	} 
	else {
		const digitsToLeft = -exponent;
		
		if (digitsToLeft >= allDigits.length) {
			const missingZeros = '0'.repeat(digitsToLeft - allDigits.length);
			
			return {
				sign,
				integerPart: '0',
				fractionalPart: missingZeros + allDigits,
			};
		}
		else {
			const splitIndex = allDigits.length - digitsToLeft;
			
			return {
				sign,
				integerPart: allDigits.slice(0, splitIndex),
				fractionalPart: allDigits.slice(splitIndex),
			};
		}
	}
}