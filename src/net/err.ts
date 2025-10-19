import type { TcpError } from '../node';

/**
 * Creates a rich {@link Error} object with a string `code` property for consistent error handling.
 *
 * @remarks
 * - This helper standardizes how your code constructs errors so downstream callers can
 *   safely inspect `error.code` (e.g., `'ENODEONLY'`, `'EBADPORT'`, `'ETIMEDOUT'`).
 * - The returned object is an `Error` augmented with optional Node-style fields via the
 *   {@link TcpError} interface.
 * - The cast to `TcpError` assumes a local type that is compatible with {@link TcpError}
 *   (i.e., extends `Error` and includes an optional `code: string`). If you don’t have
 *   such a type, ensure that `TcpError` is defined accordingly or change the cast to
 *   `unknown as TcpError`. The runtime behavior is the same—this helper adds `code`.
 *
 * @param code - Short, machine-readable identifier of the error condition
 * (e.g., `'EBADHOST'`, `'EBADMSG'`, `'ETIMEDOUT'`, `'EABORT'`). Kept in `error.code`.
 * @param message - Optional human-readable description. Defaults to `code` when omitted.
 *
 * @returns A newly created {@link TcpError} whose `.message` is `message ?? code`
 * and whose `.code` equals the provided `code`.
 *
 * @example
 * ```ts
 * throw err('EBADPORT', '`port` must be 1..65535');
 * ```
 *
 * @example
 * ```ts
 * try {
 *   // ...something that may fail...
 * } catch (e) {
 *   // Wrap unknown failures with a standardized code
 *   throw err('EUNEXPECTED', (e as Error)?.message);
 * }
 * ```
 *
 * @since 2.0.0
 */
export function err(code: string, message?: string): TcpError {
	const e = new Error(message ?? code) as TcpError;
	
	e.code = code;
	
	return e;
}
