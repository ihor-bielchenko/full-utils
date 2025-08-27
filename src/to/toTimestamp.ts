
export function toTimestamp(value: number): {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
} {
	const days = Math.floor(value / 86400);
	const hours = Math.floor((value % 86400) / 3600);
	const minutes = Math.floor((value % 3600) / 60);
	const seconds = value % 60;

	return { days, hours, minutes, seconds };
}
