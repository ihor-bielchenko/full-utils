/**
 * Floors a given {@link Date} object down to the nearest time interval in minutes.
 *
 * @remarks
 * This utility function is commonly used for time bucketing, grouping logs, or
 * aligning timestamps to fixed intervals (e.g. 5-minute or 15-minute marks).
 *
 * It takes an arbitrary `Date` and returns a **new** `Date` instance (it does not
 * mutate the input) where:
 *
 * - The `minutes` value is floored down to the nearest multiple of `everyMinutes`.
 * - `seconds` and `milliseconds` are reset to `0`.
 * - The hour and day remain unchanged.
 *
 * The step is automatically clamped to the range **1 – 60 minutes** to prevent
 * invalid or nonsensical values.
 * 
 * The function allocates a single new `Date` object.  
 * It is safe for high-frequency use in real-time systems and event batching.
 *
 * @param everyMinutes - The step interval (in minutes) used for rounding down.
 * Must be a positive finite number.  
 * Values below 1 are treated as 1, values above 60 as 60.
 *
 * @param date - The input date to be floored.  
 * Defaults to the current time (`new Date()`).
 *
 * @returns A **new** `Date` instance, representing the same hour as the input,
 * but with minutes rounded down to the nearest `everyMinutes` multiple.
 *
 * @example
 * ```ts
 * // Example 1: Floor to the nearest 15-minute mark
 * const d = new Date('2025-10-18T10:43:27');
 * floorDateToMinutes(15, d);
 * // -> 2025-10-18T10:30:00.000Z
 * ```
 *
 * @example
 * ```ts
 * // Example 2: Using default date (current time)
 * const nowFloored = floorDateToMinutes(10);
 * // -> e.g. 2025-10-18T09:20:00.000Z
 * ```
 *
 * @example
 * ```ts
 * // Example 3: Clamp behavior
 * floorDateToMinutes(-5, new Date());  // treated as 1 minute
 * floorDateToMinutes(999, new Date()); // treated as 60 minutes
 * ```
 *
 * @throws Never throws — invalid step values are automatically normalized.
 *
 * @see {@link Date#setMinutes} for the underlying mutation logic.
 * @see {@link Date#getMinutes} for how minutes are extracted from a Date.
 *
 * @public
 * @category Date & Time
 * @since 2.0.0
 */
export function floorDateToMinutes(everyMinutes = 1, date = new Date()): Date {
	const step = Math.min(60, Math.max(1, Math.trunc(Math.abs(everyMinutes))));
	const m = date.getMinutes();
	const floored = Math.floor(m / step) * step;
	const d = new Date(date);
	
	d.setMinutes(floored, 0, 0);
	
	return d;
}
