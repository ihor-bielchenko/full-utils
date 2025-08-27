
export function fromTimestamp(parts: {
	days?: number;
	hours?: number;
	minutes?: number;
	seconds?: number;
}): number {
	const { days = 0, hours = 0, minutes = 0, seconds = 0 } = parts;

	return days * 86400 + hours * 3600 + minutes * 60 + seconds;
}
