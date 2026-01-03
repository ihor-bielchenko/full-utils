import type { TimeParts } from '../index';
import { dateSecParts } from '../index';

export function datePartsSec(parts: TimeParts): number {
	const { days = 0, hours = 0, minutes = 0, seconds = 0 } = parts;

	return days * 86400 + hours * 3600 + minutes * 60 + seconds;
}
