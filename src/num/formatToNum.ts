import { 
	fixedDecimalToNum,
	parseToFixedDecimal,
	roundFixedDecimal, 
} from '../index';

/**
 * Converts an arbitrary numeric input to a JavaScript `number`, optionally rounding
 * it to a fixed number of fractional digits using **half-up** rounding.
 *
 * @remarks
 * This function is a convenience wrapper around your fixed-precision helpers:
 *
 * 1. {@link parseToFixedDecimal} — parses the unknown input (`number`/`string`/etc.)
 *    into an exact, lossless fixed-decimal representation.
 * 2. `roundFixedDecimal` — (invoked only when `round > 1`) rounds that fixed-decimal
 *    value to the requested scale using the **half-up** algorithm.
 * 3. {@link fixedDecimalToNum} — converts the (optionally rounded) fixed-decimal
 *    back to a JavaScript `number`.
 *
 * Because rounding is done in fixed-precision space, you avoid common IEEE-754
 * floating-point artifacts (e.g., `0.1 + 0.2 !== 0.3`) during parsing/rounding.
 * Precision is finally limited only at the last step when the value is converted
 * to a JS `number`.
 *
 * @param value - Any value that represents a number. Typical cases:
 * - `number` (e.g., `12`, `-0.034`, `1e6`)
 * - numeric `string` (e.g., `"42"`, `"-123.456"`)
 * - values that your {@link parseToFixedDecimal} knows how to normalize.
 *
 * If the value cannot be parsed by {@link parseToFixedDecimal}, an error will be thrown from there.
 *
 * @param round - Target number of fractional digits for rounding **in fixed-precision**.
 * - If `round > 1`, the function rounds to exactly `round` digits after the decimal point
 *   using **half-up** (i.e., `.5` rounds away from zero) via `roundFixedDecimal`.
 * - If `round <= 1`, no rounding is applied; the parsed value is passed through as-is.
 *
 * @defaultValue `1` (no rounding; passthrough)
 *
 * @returns The resulting numeric value as a JavaScript `number`.
 *
 * @throws {Error}
 * - Re-throws any parsing/normalization errors from {@link parseToFixedDecimal}.
 * - Re-throws any rounding errors from `roundFixedDecimal` (e.g., invalid scale).
 *
 * @example
 * // No rounding (default `round = 1` → passthrough)
 * formatToNum("123.456");         // => 123.456
 * formatToNum(0.034);             // => 0.034
 *
 * @example
 * // Round to 2 fractional digits (half-up)
 * formatToNum("123.456", 2);      // => 123.46  (because .456 → .46)
 * formatToNum("-1.235", 2);       // => -1.24   (half-up away from zero)
 *
 * @example
 * // Large values: parsed and rounded in fixed precision, then converted to number
 * formatToNum("234893249238948.000003432", 6); // precise rounding in fixed space,
 *                                              // final result as JS number
 *
 * @example
 * // Explicit passthrough (any `round <= 1` behaves the same)
 * formatToNum("1000.555", 1);     // => 1000.555 (no rounding step invoked)
 * formatToNum("1000.555", 0);     // => 1000.555 (still no rounding)
 *
 * @see parseToFixedDecimal
 * @see fixedDecimalToNum
 * @see roundFixedDecimal
 *
 * @category Number Formatting
 * @since 2.0.0
 * @public
 */
export function formatToNum(value: unknown, round: number = 1): number {
	return fixedDecimalToNum((round > 1) ? roundFixedDecimal(parseToFixedDecimal(value), round, 'half-up') : parseToFixedDecimal(value));
}
