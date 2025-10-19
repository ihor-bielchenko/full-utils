import type { TimeParts } from '../index';
import { secondsToParts } from '../index';

/**
 * Converts a partial {@link TimeParts} structure (days, hours, minutes, seconds)
 * into a total number of **seconds**.
 *
 * @remarks
 * This helper provides a simple way to normalize human-readable time components
 * into a single scalar duration in seconds.  
 * It can be useful for:
 * - time-based arithmetic (e.g., adding offsets to timestamps),
 * - scheduling or delay computation,
 * - serializing durations into numeric fields (e.g., databases or APIs).
 *
 * All fields (`days`, `hours`, `minutes`, `seconds`) are **optional**; any missing
 * value defaults to `0`. The calculation uses fixed conversion factors:
 *
 * - 1 day = 86 400 seconds  
 * - 1 hour = 3 600 seconds  
 * - 1 minute = 60 seconds
 * 
 * - Fractional or negative numbers are accepted and processed arithmetically.
 *   Example: `{ minutes: 1.5 }` → `90`; `{ hours: -1 }` → `-3600`.
 * - The function performs no validation; it assumes numeric input.
 *   TypeScript typing (`number`) ensures intended usage.
 *
 * @param parts - A partial object containing any subset of time fields.
 * Missing values default to zero.
 *
 * @returns The total number of seconds represented by the provided time parts.
 *
 * @example
 * ```ts
 * // Example 1: Simple conversion
 * partsToSeconds({ hours: 1, minutes: 30 }); // -> 5400
 *
 * // Example 2: Full time span
 * partsToSeconds({ days: 2, hours: 3, minutes: 5, seconds: 10 });
 * // -> 183910
 *
 * // Example 3: Partial / missing fields
 * partsToSeconds({}); // -> 0
 * partsToSeconds({ minutes: 5 }); // -> 300
 * ```
 *
 * @throws Never throws.
 *
 * @see {@link secondsToParts} — the inverse operation that expands seconds back into components.
 *
 * @public
 * @category Date & Time
 * @since 2.0.0
 */
export function partsToSeconds(parts: {
	days?: number;
	hours?: number;
	minutes?: number;
	seconds?: number;
}): number {
	const { days = 0, hours = 0, minutes = 0, seconds = 0 } = parts;

	return days * 86400 + hours * 3600 + minutes * 60 + seconds;
}
