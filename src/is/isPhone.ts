
export function isPhone(value): boolean {
	const valueProcessed = String(value);

	if (valueProcessed[0] === '-'
		|| (valueProcessed[0] === '+' && valueProcessed[1] === '-')) {
		return false;
	}
	return /(^[+]?)([0-9-]+$)/.test(valueProcessed) 
		&& valueProcessed.length >= 3 
		&& valueProcessed.length <= 20
		&& Number(valueProcessed[valueProcessed.length - 1]) >= 0
		&& valueProcessed.split('-').findIndex((item: string) => item === '') === -1;
}
