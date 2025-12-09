import type { TimeParts } from '../index';
import { datePartsSec } from '../index';

/**
 * Decomposes a total number of seconds into discrete time components:
 * **days**, **hours**, **minutes**, and **seconds**.
 *
 * @remarks
 * This is the inverse operation of {@link datePartsSec}.
 * It converts a flat duration (in seconds) into a more human-readable structure
 * suitable for display, logging, or formatting.
 *
 * The function performs integer division using {@link Math.floor} for each component
 * and ensures that the result satisfies:
 *
 * ```
 * 0 <= hours < 24  
 * 0 <= minutes < 60  
 * 0 <= seconds < 60
 * ```
 *
 * Any fractional part of the input (e.g., `12.75`) is truncated (floored) to the
 * nearest lower whole second.  
 * Negative or non-finite inputs are considered invalid and will throw an error.
 * 
 * - Uses only a few arithmetic operations and is **O(1)**.
 * - Safe for real-time conversions or high-frequency usage (e.g., monitoring dashboards).
 *
 * @param total - Total duration in seconds.  
 * Must be a **finite, non-negative number**.
 *
 * @returns A {@link TimeParts} object with integer fields:
 * - `days`
 * - `hours`
 * - `minutes`
 * - `seconds`
 *
 * @example
 * ```ts
 * // Example 1: Basic conversion
 * dateSecParts(3661);
 * // -> { days: 0, hours: 1, minutes: 1, seconds: 1 }
 * ```
 *
 * @example
 * ```ts
 * // Example 2: Multi-day value
 * dateSecParts(90061);
 * // -> { days: 1, hours: 1, minutes: 1, seconds: 1 }
 * ```
 *
 * @example
 * ```ts
 * // Example 3: Invalid input
 * dateSecParts(-10); // throws Error("Invalid total seconds")
 * dateSecParts(NaN); // throws Error("Invalid total seconds")
 * ```
 *
 * @throws {Error}
 * Thrown when `total` is not a finite, non-negative number.
 *
 * @see {@link datePartsSec} — the complementary function that aggregates components into seconds.
 * @see {@link TimeParts} — the return type describing the breakdown of time.
 *
 * @public
 * @category Date & Time
 * @since 2.0.0
 */
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
