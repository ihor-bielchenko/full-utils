import type { TimeParts } from './types';

/**
 * Decomposes a total number of seconds into discrete time components:
 * **days**, **hours**, **minutes**, and **seconds**.
 *
 * @remarks
 * This is the inverse operation of {@link partsToSeconds}.
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
 * secondsToParts(3661);
 * // -> { days: 0, hours: 1, minutes: 1, seconds: 1 }
 * ```
 *
 * @example
 * ```ts
 * // Example 2: Multi-day value
 * secondsToParts(90061);
 * // -> { days: 1, hours: 1, minutes: 1, seconds: 1 }
 * ```
 *
 * @example
 * ```ts
 * // Example 3: Invalid input
 * secondsToParts(-10); // throws Error("Invalid total seconds")
 * secondsToParts(NaN); // throws Error("Invalid total seconds")
 * ```
 *
 * @throws {Error}
 * Thrown when `total` is not a finite, non-negative number.
 *
 * @performance
 * - Uses only a few arithmetic operations and is **O(1)**.
 * - Safe for real-time conversions or high-frequency usage (e.g., monitoring dashboards).
 *
 * @see {@link partsToSeconds} — the complementary function that aggregates components into seconds.
 * @see {@link TimeParts} — the return type describing the breakdown of time.
 *
 * @public
 * @category Date & Time
 * @since 1.0.0
 */
export function secondsToParts(total: number): TimeParts {
	if (!Number.isFinite(total) || total < 0) {
		throw new Error('Invalid total seconds');
	}
	const days = Math.floor(total / 86400);
	const hours = Math.floor((total % 86400) / 3600);
	const minutes = Math.floor((total % 3600) / 60);
	const seconds = total % 60;
	
	return { days, hours, minutes, seconds };
}
