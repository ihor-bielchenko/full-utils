
export function dateFloorMin(everyMinutes = 1, date = new Date()): Date {
	const step = Math.min(60, Math.max(1, Math.trunc(Math.abs(everyMinutes))));
	const m = date.getMinutes();
	const floored = Math.floor(m / step) * step;
	const d = new Date(date);
	
	d.setMinutes(floored, 0, 0);
	
	return d;
}
