import { 
	isNum,
	formatToNum, 
} from '../index';
import { normalizeUnit } from './normalizeUnit';

const FACTOR: Record<string, number> = {
	h: 1e-9,
	k: 1e-6,
	m: 1e-3,
	g: 1,
	t: 1e3,
	p: 1e6,
	e: 1e9,
};

/**
 * Converts a hashrate (or similar magnitude value) into **gigahashes per second** (`GH/s`).
 *
 * @summary
 * Normalizes a numeric value expressed in various hash rate units (e.g., `kH/s`, `MH/s`, `TH/s`)
 * to **gigahashes (GH)**, using standard decimal scaling (`×1000` between adjacent prefixes).
 *
 * @param value - Input numeric value or string representing a number (e.g. `"1200"`, `3.5`).
 * @param unit - Optional unit string representing the magnitude (`H`, `kH`, `MH`, `GH`, `TH`, `PH`, `EH`).
 *               Case-insensitive and automatically normalized via {@link normalizeUnit}.
 *
 * @returns The normalized value expressed in **gigahashes per second (GH/s)**.
 * Returns `0` if the input is invalid or non-numeric.
 *
 * @remarks
 * ### Conversion logic
 * 1. **Parsing:**  
 *    Uses {@link formatToNum} to safely convert `value` into a number.
 *
 * 2. **Validation:**  
 *    If the parsed number is not finite (`NaN`, `Infinity`, etc.), returns `0`.
 *
 * 3. **Unit normalization:**  
 *    Calls {@link normalizeUnit} to clean up and simplify the unit name (e.g. `" MH/s "` → `"mh"`).
 *    Then takes the first character (`m`, `g`, `t`, etc.) to determine scale.
 *
 * 4. **Factor lookup:**  
 *    Applies the following conversion factors relative to gigahashes:
 *
 *    | Prefix | Unit      | Factor (to GH) | Example conversion             |
 *    |---------|-----------|----------------|--------------------------------|
 *    | `h`     | hashes/s  | `1e-9`         | `1e9 H/s` = `1 GH/s`           |
 *    | `k`     | kilohash  | `1e-6`         | `1e6 kH/s` = `1 GH/s`          |
 *    | `m`     | megahash  | `1e-3`         | `1e3 MH/s` = `1 GH/s`          |
 *    | `g`     | gigahash  | `1`            | identity                       |
 *    | `t`     | terahash  | `1e3`          | `1 TH/s` = `1000 GH/s`         |
 *    | `p`     | petahash  | `1e6`          | `1 PH/s` = `1,000,000 GH/s`    |
 *    | `e`     | exahash   | `1e9`          | `1 EH/s` = `1,000,000,000 GH/s`|
 *
 * 5. **Result validation:**  
 *    If the final result is not a finite number, throws an error.
 *    Otherwise returns the computed gigahashes value (with `-0` normalized to `0`).
 *
 * ### Behavior notes
 * - Returns `0` instead of throwing when the input cannot be parsed as a number.
 * - Uses **decimal scaling** (`×1000`), not binary (`×1024`).
 * - Handles both numeric and string inputs seamlessly.
 * - Automatically ignores plural or rate suffixes (like `/s`, `hashes`).
 *
 * ### Performance
 * - Time complexity: **O(1)**.
 * - Space complexity: **O(1)**.
 *
 * ### Examples
 *
 * @example
 * // Basic conversions
 * toGH(1, 'GH');     // => 1
 * toGH(1, 'TH');     // => 1000
 * toGH(1, 'MH');     // => 0.001
 * toGH(1, 'kH');     // => 0.000001
 * toGH(1, 'PH');     // => 1_000_000
 * toGH(1, 'EH');     // => 1_000_000_000
 *
 * @example
 * // String inputs and normalization
 * toGH('1200', 'mh/s');   // => 1.2
 * toGH('3.5', 'TH/s');    // => 3500
 *
 * @example
 * // Invalid or edge inputs
 * toGH('', 'GH');         // => 0
 * toGH(null, 'GH');       // => 0
 * toGH(NaN, 'MH');        // => 0
 *
 * @example
 * // Custom normalization of unit formatting
 * toGH(5, ' khash / s '); // => 0.000005
 * toGH(2, 'T');           // => 2000
 *
 * @see formatToNum
 * @see isNum
 * @see normalizeUnit
 *
 * @category Conversion
 * @public
 * @since 2.0.0
 */
export function toGH(value: any, unit = ''): number {
	const v = formatToNum(value);

	if (!isNum(v)) {
		return 0;
	}
	const u = normalizeUnit(unit);
	const c = u ? u[0] : 'g';
	const factor = FACTOR[c] ?? 1;
	const out = v * factor;

	if (!isNum(out)) {
		throw new Error(`toGH: result is not finite (value="${v}", unit="${u}")`);
	}
	return Object.is(out, -0) ? 0 : out;
}