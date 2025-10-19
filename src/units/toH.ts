import { 
	isNum,
	formatToNum,
} from '../index';
import { normalizeUnit } from './normalizeUnit';

const FACTOR_H: Record<string, number> = {
	h: 1,
	k: 1e3,
	m: 1e6,
	g: 1e9,
	t: 1e12,
	p: 1e15,
	e: 1e18,
};

/**
 * Converts a rate value expressed with SI hash-rate prefixes into **hashes per second** (`H/s`).
 *
 * @summary
 * Normalizes a numeric value given in `kH/s`, `MH/s`, `GH/s`, `TH/s`, `PH/s`, or `EH/s`
 * to plain **hashes per second** using **decimal scaling** (×1000 between adjacent prefixes).
 * Units are case-insensitive and sanitized via {@link normalizeUnit}.
 *
 * @param value - Input value to convert (number or number-like string, e.g. `3.5`, `"1200"`).
 * @param unit - Optional unit string (e.g. `"kH/s"`, `"MH"`, `"ghashes"`).  
 *               If omitted or empty, the function assumes **`h`** (hashes).
 *
 * @returns The value converted to **H/s** (`number`). Returns `0` if `value` is not numeric.
 *
 * @remarks
 * ### Unit handling
 * `unit` is first cleaned by {@link normalizeUnit} (trim, lowercase, remove spaces and `"/s"`, `"hash(es)"`),
 * then the **first character** determines the scale:
 *
 * | Prefix | Interpreted as | Multiplier to H/s |
 * |:------:|-----------------|-------------------|
 * | `h`    | hashes          | `1`               |
 * | `k`    | kilohashes      | `1e3`             |
 * | `m`    | megahashes      | `1e6`             |
 * | `g`    | gigahashes      | `1e9`             |
 * | `t`    | terahashes      | `1e12`            |
 * | `p`    | petahashes      | `1e15`            |
 * | `e`    | exahashes       | `1e18`            |
 *
 * Unknown or empty prefixes default to `h` (no scaling).
 *
 * ### Parsing & validation
 * - Uses {@link formatToNum} to parse `value`.
 * - If parsed value is not a finite number, returns `0`.
 * - After conversion, if the result is not finite, throws an error with details.
 * - Normalizes `-0` to `0` before returning.
 *
 * ### Decimal vs binary
 * This function uses **decimal** (SI) steps (×1000) common for hashrates.
 * For byte/size conversions use binary (×1024) helpers like `toGB`.
 *
 * ### Performance
 * - Time complexity: **O(1)**
 * - Space complexity: **O(1)**
 *
 * ### Examples
 *
 * @example
 * // Identity and basic scales
 * toH(1, 'H');     // => 1
 * toH(1, 'kH');    // => 1_000
 * toH(1, 'MH');    // => 1_000_000
 * toH(1, 'GH');    // => 1_000_000_000
 * toH(2.5, 'TH');  // => 2_500_000_000_000
 *
 * @example
 * // Large magnitudes
 * toH(1, 'PH');    // => 1_000_000_000_000_000
 * toH(0.01, 'EH'); // => 10_000_000_000_000_000
 *
 * @example
 * // Flexible, noisy units and strings
 * toH('1200', ' mh/s ');     // => 1_200_000
 * toH(3.2, 'khashes');       // => 3_200
 * toH('5', '');              // => 5   (defaults to hashes)
 *
 * @example
 * // Invalid inputs
 * toH('', 'GH');             // => 0
 * toH(null, 'MH');           // => 0
 * toH(NaN, 'kH');            // => 0
 *
 * @see normalizeUnit
 * @see formatToNum
 * @see isNum
 *
 * @category Conversion
 * @public
 * @since 2.0.0
 */
export function toH(value: any, unit = ''): number {
	const v = formatToNum(value);

	if (!isNum(v)) {
		return 0;
	}
	const u = normalizeUnit(unit);
	const c = u ? u[0] : 'h';
	const factor = FACTOR_H[c] ?? 1;
	const out = v * factor;

	if (!isNum(out)) {
		throw new Error(`toH: result is not finite (value="${v}", unit="${u}")`);
	}
	return Object.is(out, -0) ? 0 : out;
}
