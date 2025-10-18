import { isNum } from '../is/isNum';
import { formatToNum } from '../num/formatToNum';

const KB = 1024;
const MB = KB * 1024;
const GB = MB * 1024;
const TB = GB * 1024;
const PB = TB * 1024;

/**
 * Converts a numeric value with a given unit (bytes, KB, MB, GB, TB, PB)
 * into gigabytes (`GB`).
 *
 * @summary
 * Safely normalizes a size value of any supported unit into **gigabytes**,
 * using binary multiples (`1 KB = 1024 bytes`, `1 MB = 1024 KB`, etc.).
 *
 * @param value - Numeric value to convert (e.g., `512`, `"1.5"`, `"2048MB"`).
 * @param unit - Optional unit string indicating the scale of `value`.
 *               Case-insensitive. Supported prefixes:
 *               `"B"`, `"KB"`, `"MB"`, `"GB"`, `"TB"`, `"PB"`.
 *
 * @returns The value converted to gigabytes (`number`).
 *
 * @throws {Error}  
 * Throws an error if the input value cannot be parsed as a finite number,  
 * or if the computed result is `NaN` or `Infinity`.
 *
 * @remarks
 * ### Supported units
 * | Unit | Interpreted as | Conversion formula |
 * |------|----------------|--------------------|
 * | `b`, `B`, `bytes`     | bytes              | `v / GB` |
 * | `k`, `kb`, `kilobyte` | kilobytes          | `v / MB` |
 * | `m`, `mb`, `megabyte` | megabytes          | `v / GB` |
 * | `g`, `gb`, `gigabyte` | gigabytes          | `v` |
 * | `t`, `tb`, `terabyte` | terabytes          | `v * 1024` |
 * | `p`, `pb`, `petabyte` | petabytes          | `v * (1024²)` |
 *
 * If no unit is provided, gigabytes (`GB`) are assumed by default.
 *
 * ### Normalization steps
 * 1. Convert `value` to a numeric value using {@link formatToNum}.
 * 2. Validate via {@link isNum} — must be finite.
 * 3. Normalize `unit`:
 *    - Trim whitespace.
 *    - Convert to lowercase.
 *    - Extract first character (e.g., `'k'` for `"KB"`).
 * 4. Compute conversion factor depending on the first letter.
 * 5. Normalize `-0` to `0` before returning.
 *
 * ### Behavior notes
 * - Throws descriptive errors on invalid inputs.
 * - Supports string-based numeric inputs (`"2048"`, `"1.5"`, etc.).
 * - Ignores case and trailing spaces in the unit name.
 * - Uses binary (IEC-style) 1024-based units — not SI 1000-based.
 *
 * ### Performance
 * - Time complexity: **O(1)**.
 * - Space complexity: **O(1)**.
 *
 * ### Examples
 *
 * @example
 * // Basic conversions
 * toGB(1024, 'MB');   // => 1
 * toGB(1, 'GB');      // => 1
 * toGB(1, 'TB');      // => 1024
 * toGB(0.5, 'TB');    // => 512
 *
 * @example
 * // From bytes
 * toGB(1073741824, 'B'); // => 1
 * toGB('2147483648', 'b'); // => 2
 *
 * @example
 * // From petabytes
 * toGB(1, 'PB'); // => 1048576
 *
 * @example
 * // Auto-handling and normalization
 * toGB(' 1.5 ', ' mb ');   // => 0.00146484375
 * toGB('2', '');           // => 2  (default is GB)
 *
 * @example
 * // Invalid inputs
 * toGB('abc', 'GB');       // throws Error("toGB: value "abc" is not numeric")
 * toGB(NaN, 'MB');         // throws Error("toGB: result is not finite...")
 *
 * @see isNum
 * @see formatToNum
 *
 * @category Conversion
 * @public
 * @since 1.0.0
 */
export function toGB(value: unknown, unit = ''): number {
	const v = formatToNum(value as any);
	
	if (!isNum(v)) {
		throw new Error(`toGB: value "${value}" is not numeric`);
	}
	const u = String(unit).trim().toLowerCase().replace(/\s+/g, '');
	const c = u ? u[0] : 'g';
	let out: number;
	
	switch (c) {
		case 'b':
			out = v / GB;
			break;
		case 'k':
			out = v / MB;
			break;
		case 'm':
			out = v / GB;
			break;
		case 'g':
			out = v;
			break;
		case 't':
			out = v * (TB / GB);
			break;
		case 'p':
			out = v * (PB / GB);
			break;
		default:
			out = v;
			break;
	}
	if (!isNum(out)) {
		throw new Error(`toGB: result is not finite (value="${value}", unit="${unit}")`);
	}
	return Object.is(out, -0) ? 0 : out;
}
