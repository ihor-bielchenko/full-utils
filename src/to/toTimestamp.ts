
export function toTimestamp(value: number): { 
	days: number; 
	hours: number; 
	minutes: number; 
	seconds: number; 
} {
	const hours = Math.trunc(value / 3600);
	const hoursSeconds = hours * 3600;
	const hoursRest = value - hoursSeconds;
	const minutes = Math.trunc(hoursRest / 60);
	const minutesSecinds = minutes * 60;
	const minutesRest = hoursRest - minutesSecinds;
	const days = Math.trunc(hours / 24);
	const daysRest = hours - 24;

	return {
		days,
		hours: (daysRest < 0)
			? (24 + daysRest)
			: daysRest,
		minutes,
		seconds: minutesRest,
	};
}
