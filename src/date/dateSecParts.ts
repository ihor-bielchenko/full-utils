import type { TimeParts } from '../index';
import { datePartsSec } from '../index';

export function dateSecParts(total: number): TimeParts {
	if (!Number.isFinite(total) || total < 0) {
		throw new Error('Invalid total seconds');
	}
	const days = Math.floor(total / 86400);
	const hours = Math.floor((total % 86400) / 3600);
	const minutes = Math.floor((total % 3600) / 60);
	const seconds = total % 60;
	
	return { days, hours, minutes, seconds };
}
