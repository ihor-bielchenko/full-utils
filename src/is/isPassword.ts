import type { PasswordOptions } from '../index';
import { isStr } from '../index';

/**
 * Validates whether a string meets configurable **password strength requirements**.
 *
 * @summary
 * A flexible password validation helper that checks for length, uppercase and lowercase letters,
 * digits, and special characters.  
 * All rules are configurable through the optional {@link PasswordOptions} parameter.
 *
 * @param value - The value to validate as a password.
 * @param options - Optional validation rules (see {@link PasswordOptions}).  
 * Defaults ensure strong password requirements:
 * ```ts
 * {
 *   minLength: 8,
 *   maxLength: 256,
 *   requireUppercase: true,
 *   requireLowercase: true,
 *   requireDigit: true,
 *   requireSpecial: true
 * }
 * ```
 *
 * @returns `true` if the value is a valid string matching all configured requirements, otherwise `false`.
 *
 * @remarks
 * ### Behavior
 * 1. Ensures `value` is a string using {@link isStr}.
 * 2. Enforces **length limits** (`minLength` ≤ length ≤ `maxLength`).
 * 3. Optionally checks for:
 *    - Uppercase characters (Latin or Cyrillic): `/[A-ZА-Я]/`
 *    - Lowercase characters (Latin or Cyrillic): `/[a-zа-я]/`
 *    - Digits: `/\d/`
 *    - Special characters: `/[~!?@#$%^&*_\-+()\[\]{}><\\\/|"'.,:;=]/`
 * 4. Returns `true` only if all active checks pass.
 *
 * ### Default rule set (strong password)
 * - At least 8 characters long  
 * - Contains uppercase and lowercase letters  
 * - Contains at least one digit  
 * - Contains at least one special symbol  
 * - Not longer than 256 characters
 *
 * ### Example configuration
 * ```ts
 * // Minimal check — only length between 6 and 20
 * isPassword('abcdef', { minLength: 6, maxLength: 20, requireSpecial: false });
 *
 * // Strict corporate policy
 * isPassword('Qwerty#123', { minLength: 10, requireSpecial: true });
 *
 * // Simplified mobile app rule
 * isPassword('myPass1', { requireSpecial: false });
 * ```
 *
 * ### Type narrowing
 * When this function returns `true`, TypeScript infers:
 * ```ts
 * value is string
 * ```
 * allowing you to safely treat it as a verified password.
 *
 * ### Performance
 * - Time complexity: **O(n)** (depends on string length and regex scans).
 * - Space complexity: **O(1)**.
 *
 * ### Examples
 *
 * @example
 * // Default strong policy (8+ chars, upper, lower, digit, special)
 * isPassword('Aa1@aaaa');        // => true
 * isPassword('Password123!');    // => true
 * isPassword('qwerty');          // => false (no upper/digit/special)
 *
 * @example
 * // Custom rules
 * isPassword('abc123', {
 *   minLength: 6,
 *   requireUppercase: false,
 *   requireSpecial: false
 * }); // => true
 *
 * @example
 * // Invalid inputs
 * isPassword('');                // => false
 * isPassword(null);              // => false
 * isPassword(undefined);         // => false
 * isPassword(123456);            // => false
 *
 * @see isStr
 *
 * @category Validation
 * @public
 * @since 2.0.0
 */
export function isPassword(
	value: unknown,
	{
		minLength = 8,
		maxLength = 256,
		requireUppercase = true,
		requireLowercase = true,
		requireDigit = true,
		requireSpecial = true,
	}: PasswordOptions = {}
): value is string {
	if (!isStr(value)) {
		return false;
	}
	if (value.length < minLength || value.length > maxLength) {
		return false;
	}
	if (requireUppercase && !/[A-ZА-Я]/.test(value)) {
		return false;
	}
	if (requireLowercase && !/[a-zа-я]/.test(value)) {
		return false;
	}
	if (requireDigit && !/\d/.test(value)) {
		return false;
	}
	if (requireSpecial && !/[~!?@#$%^&*_\-+()\[\]{}><\\\/|"'.,:;=]/.test(value)) {
		return false;
	}
	return true;
}
