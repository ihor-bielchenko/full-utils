
/**
 * Formats a {@link Date} object into a human-readable timestamp string
 * using the pattern `"YYYY-MM-DD HH:mm:ss"`.
 *
 * @remarks
 * This function is a simple and locale-independent date formatter that always
 * outputs a **24-hour clock** timestamp with leading zeros for all numeric parts.
 *  
 * It does **not** depend on the user's locale or time zone settings beyond what
 * is stored in the provided `Date` object. If you pass a `Date` constructed
 * from UTC or local time, the formatted output will reflect that same basis.
 *
 * Each date/time component (month, day, hours, minutes, seconds) is padded to
 * two digits using {@link String.padStart}, ensuring consistent width such as
 * `2025-03-07 09:04:02`.
 *
 * @param date - The date to format. Defaults to the **current system time**
 * (`new Date()`).
 *
 * @returns A formatted timestamp string in `"YYYY-MM-DD HH:mm:ss"` form.
 *
 * @example
 * ```ts
 * // Example 1: Specific date
 * const d = new Date('2025-10-18T10:43:27Z');
 * formatDateToString(d);
 * // -> "2025-10-18 10:43:27"
 * ```
 *
 * @example
 * ```ts
 * // Example 2: Default (current) date
 * formatDateToString();
 * // -> e.g. "2025-10-18 12:07:55"
 * ```
 *
 * @example
 * ```ts
 * // Example 3: Padding behavior
 * const d = new Date('2025-03-07T09:04:02');
 * formatDateToString(d);
 * // -> "2025-03-07 09:04:02"
 * ```
 *
 * @throws Never throws.
 *
 * @notes
 * - The format is fixed-width and consistent — ideal for logs, filenames,
 *   and database-friendly timestamps.
 * - The output is **not ISO 8601** (which uses a `'T'` separator and optional
 *   timezone offset).  
 *   Example: ISO → `"2025-10-18T10:43:27Z"`  
 *   This function → `"2025-10-18 10:43:27"`.
 *
 * @see {@link Date} for JavaScript’s native date-handling API.
 * @see {@link Intl.DateTimeFormat} for locale-aware formatting if needed.
 *
 * @public
 * @category Date & Time
 * @since 1.0.0
 */
export function formatDateToString(date = new Date()): string {
	const pad = (n: number) => String(n).padStart(2, '0');

	const year = date.getFullYear();
	const month = pad(date.getMonth() + 1);
	const day = pad(date.getDate());

	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());
	const seconds = pad(date.getSeconds());

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
