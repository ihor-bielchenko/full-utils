import { format } from 'date-fns';

export function toCellDate(everyMinutes = 1, date = new Date()) {
	everyMinutes = Math.trunc(Math.abs(everyMinutes));
	everyMinutes = (everyMinutes < 1 || everyMinutes > 60)
		? 15
		: everyMinutes;

	const nowMinutes = date.getMinutes();
	const countSwitches = 60 / everyMinutes;
	let quarter = '00:00',
		i = 0,
		incrMinutes = 0;

	while (i < countSwitches) {
		const newIncr = incrMinutes + everyMinutes;

		if (nowMinutes >= incrMinutes
			&& nowMinutes < newIncr) {
			quarter = `${(incrMinutes >= 10)
				? incrMinutes
				: `0${incrMinutes}`}:00`;
		}
		incrMinutes = newIncr;
		i++;
	}
	return new Date(`${format(date, 'yyyy-MM-dd HH')}:${quarter}`);
}
