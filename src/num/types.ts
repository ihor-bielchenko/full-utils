
/**
 * Represents a **fixed-precision decimal number** using exact integer arithmetic.
 *
 * @remarks
 * JavaScript’s native `number` type uses 64-bit IEEE-754 floating-point representation,
 * which introduces rounding errors for many decimal values  
 * (for example, `0.1 + 0.2 !== 0.3`).  
 *  
 * `FixedDecimal` provides a lossless, predictable alternative by separating
 * the number into three explicit components:
 *
 * - **`sign`** → numeric sign (`1` for positive values, `-1` for negative ones)
 * - **`digitsInteger`** → all digits of the number stored as a `BigInt`
 *   (the decimal point is removed)
 * - **`scale`** → number of digits that were originally after the decimal point
 *
 * Together, these three parts allow precise decimal math, rounding,
 * and string/number conversions without losing accuracy.
 *
 * ---
 * **Conceptual example**
 *
 * The decimal value:
 * ```
 * -123.456
 * ```
 * would be represented as:
 * ```ts
 * {
 *   sign: -1,
 *   digitsInteger: 123456n,
 *   scale: 3
 * }
 * ```
 *
 * which mathematically equals:
 * ```
 * sign × (digitsInteger / 10^scale)
 * = -1 × (123456 / 10^3)
 * = -123.456
 * ```
 *
 * ---
 * **Usage**
 *
 * Instances of `FixedDecimal` are typically produced and consumed by utility functions:
 * - {@link parseToFixedDecimal} — converts arbitrary input (`string`/`number`/`bigint`) to `FixedDecimal`
 * - {@link roundFixedDecimal} — rounds to a target number of fractional digits
 * - {@link fixedDecimalToStr} — converts back to a human-readable string
 * - {@link fixedDecimalToNum} — converts to a JavaScript `number` (with possible precision loss)
 *
 * ---
 * @property sign - Numeric sign of the value.  
 * `1` for positive and zero values, `-1` for negative ones.
 *
 * @property digitsInteger - A `BigInt` holding all digits of the number
 * without any decimal separator.  
 * Example: `"123.45"` → `digitsInteger = 12345n`.
 *
 * @property scale - Number of digits that appear after the decimal point
 * in the original value.  
 * Example: `"123.45"` → `scale = 2`.
 *
 * ---
 * @example
 * // Example: 0.034 represented as FixedDecimal
 * const fd: FixedDecimal = {
 *   sign: 1,
 *   digitsInteger: 34n,
 *   scale: 3
 * };
 * // mathematically:  1 × (34 / 10³) = 0.034
 *
 * @example
 * // Example: -987000.00 → same magnitude, different scale
 * const fd2: FixedDecimal = {
 *   sign: -1,
 *   digitsInteger: 98700000n,
 *   scale: 2
 * };
 * // -987000.00
 *
 * @example
 * // Zero value representation
 * const zero: FixedDecimal = {
 *   sign: 1,
 *   digitsInteger: 0n,
 *   scale: 0
 * };
 *
 * @see parseToFixedDecimal
 * @see roundFixedDecimal
 * @see fixedDecimalToStr
 * @see fixedDecimalToNum
 *
 * @category Types
 * @since 2.0.0
 * @public
 */
export interface FixedDecimal {
	/** 
	 * The numeric sign of the value: 
	 * `1` for positive or zero, `-1` for negative.
	 */
	sign: 1 | -1;

	/**
	 * All digits of the number stored as a `BigInt`, 
	 * with the decimal point removed.
	 */
	digitsInteger: bigint;

	/**
	 * The number of digits that originally appeared 
	 * after the decimal point.
	 */
	scale: number;
}
