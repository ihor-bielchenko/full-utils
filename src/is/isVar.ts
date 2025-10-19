import { isStr } from '../index';

/**
 * Checks whether a given value is a **valid variable-like identifier**.
 *
 * @summary
 * A strict type guard that returns `true` only if the value is a string
 * matching the pattern of a valid **programming variable name**:  
 * must start with a letter (`A–Z`, `a–z`) or underscore (`_`),
 * and may contain only letters, digits, or underscores afterward.
 *
 * @param value - Any value to test.
 *
 * @returns `true` if the value is a syntactically valid variable name; otherwise `false`.
 *
 * @remarks
 * ### Validation rule
 * Uses the following regular expression:
 * ```regex
 * /^[A-Za-z_][A-Za-z0-9_]*$/
 * ```
 * This enforces:
 * - **First character:** a Latin letter (`A–Z`, `a–z`) or underscore (`_`)
 * - **Subsequent characters:** any combination of letters, digits, or underscores
 * - **No spaces, symbols, or Unicode letters** are allowed
 *
 * ### Typical use cases
 * - Validating variable names in configuration files or templates
 * - Checking safe property keys for code generation
 * - Ensuring identifiers in scripting or parsing logic
 *
 * ### Behavior
 * - Returns `false` for:
 *   - Strings starting with digits (`"1abc"`)
 *   - Strings containing hyphens or spaces (`"my-var"`, `"user name"`)
 *   - Empty strings or non-string values
 * - Returns `true` for:
 *   - `"name"`, `"_value"`, `"myVar1"`, `"SOME_CONSTANT"`
 *
 * ### Type narrowing
 * When this function returns `true`, TypeScript infers:
 * ```ts
 * value is string
 * ```
 * ensuring safe string usage in contexts like symbol tables or identifier maps.
 *
 * ### Performance
 * - Time complexity: **O(n)** — proportional to string length (regex evaluation)
 * - Space complexity: **O(1)**
 *
 * ### Examples
 *
 * @example
 * // Valid identifiers
 * isVar('name');          // => true
 * isVar('_id');           // => true
 * isVar('myVar1');        // => true
 * isVar('SOME_CONSTANT'); // => true
 *
 * @example
 * // Invalid identifiers
 * isVar('');              // => false
 * isVar('1var');          // => false
 * isVar('user-name');     // => false
 * isVar('my var');        // => false
 * isVar('$value');        // => false
 *
 * @example
 * // Non-string values
 * isVar(null);            // => false
 * isVar(123);             // => false
 * isVar({});              // => false
 *
 * @see isStr
 * @see isStrFilled
 *
 * @category Validation
 * @public
 * @since 2.0.0
 */
export function isVar(value: unknown): value is string {
	return isStr(value) && /^[A-Za-z_][A-Za-z0-9_]*$/.test(value);
}
