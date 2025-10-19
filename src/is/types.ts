/**
 * Configuration options that define password validation rules.
 *
 * This interface allows you to specify various constraints
 * that determine whether a given password is considered valid.
 *
 * @example
 * ```ts
 * const options: PasswordOptions = {
 *   minLength: 8,
 *   maxLength: 32,
 *   requireUppercase: true,
 *   requireLowercase: true,
 *   requireDigit: true,
 *   requireSpecial: true,
 * };
 * ```
 *
 * @remarks
 * You can use these options to build password validation functions,
 * enforce strong password policies, or configure authentication modules.
 *
 * @since 2.0.0
 */
export interface PasswordOptions {
	/**
	 * Minimum allowed number of characters in the password.
	 *
	 * @defaultValue `0`
	 * @example
	 * ```ts
	 * { minLength: 8 } // password must contain at least 8 characters
	 * ```
	 */
	minLength?: number;

	/**
	 * Maximum allowed number of characters in the password.
	 *
	 * @defaultValue `Infinity`
	 * @example
	 * ```ts
	 * { maxLength: 32 } // password cannot exceed 32 characters
	 * ```
	 */
	maxLength?: number;

	/**
	 * Whether the password must contain at least one uppercase Latin letter (A–Z).
	 *
	 * @defaultValue `false`
	 * @example
	 * ```ts
	 * { requireUppercase: true } // 'Password1' - OK 'password1' - BAD
	 * ```
	 */
	requireUppercase?: boolean;

	/**
	 * Whether the password must contain at least one lowercase Latin letter (a–z).
	 *
	 * @defaultValue `false`
	 * @example
	 * ```ts
	 * { requireLowercase: true } // 'PASSWORD1' - BAD 'Password1' - OK
	 * ```
	 */
	requireLowercase?: boolean;

	/**
	 * Whether the password must include at least one numeric digit (0–9).
	 *
	 * @defaultValue `false`
	 * @example
	 * ```ts
	 * { requireDigit: true } // 'Password' - BAD 'Password1' - OK
	 * ```
	 */
	requireDigit?: boolean;

	/**
	 * Whether the password must include at least one special character
	 * (such as `!@#$%^&*()-_=+[]{};:'",.<>/?`).
	 *
	 * @defaultValue `false`
	 * @example
	 * ```ts
	 * { requireSpecial: true } // 'Password1' - BAD 'Password1!' - OK
	 * ```
	 */
	requireSpecial?: boolean;
}
