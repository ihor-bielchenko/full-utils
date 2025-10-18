
/**
 * Options controlling TCP connection behavior, request formatting, and response handling.
 *
 * @public
 */
export interface NetTCPOptions {
	/**
	 * Remote TCP port to connect to.
	 *
	 * @defaultValue 4028
	 * @remarks Must be an integer in the range 1–65535, otherwise `EBADPORT` is thrown.
	 */
	port?: number;
	
	/**
	 * Idle timeout in milliseconds applied to the underlying socket.
	 * If no data is received within this period after connection, the operation fails.
	 *
	 * @defaultValue 0 (no idle timeout)
	 * @remarks On expiry, the promise rejects with `ETIMEDOUT` ("Idle timeout").
	 */
	timeoutMs?: number;
	
	/**
	 * Cooperative cancellation token. If the signal is already aborted (or aborts later),
	 * the operation is terminated early.
	 *
	 * @remarks Rejects with `EABORT` ("Operation cancelled").
	 */
	signal?: AbortSignal;
	
	/**
	 * Hard cap on response size in bytes. If the cumulative number of bytes read
	 * exceeds this limit, the read is aborted.
	 *
	 * @defaultValue 0 (no limit)
	 * @remarks On overflow, rejects with `ERESPONSE_TOO_LARGE`.
	 */
	maxBytes?: number;
	
	/**
	 * When `true`, call `socket.end()` immediately after the request payload is fully written.
	 * This is useful for protocols where the client signals “no more data” by half-closing.
	 *
	 * @defaultValue false
	 */
	halfCloseAfterWrite?: boolean;
	
	/**
	 * Optional line terminator automatically appended to the outgoing message.
	 *
	 * @defaultValue '' (no terminator)
	 * @remarks Common values are `'\n'` or `'\r\n'` for CRLF-terminated protocols.
	 */
	lineTerminator?: '' | '\n' | '\r\n';
	
	/**
	 * Separate timeout for the **connect phase** (DNS+TCP handshake).
	 * If the connection is not established within this period, the operation fails.
	 *
	 * @defaultValue 0 (no connect timeout)
	 * @remarks On expiry, rejects with `ETIMEDOUT` ("Connect timed out").
	 */
	connectTimeoutMs?: number;
	
	/**
	 * Text encoding used to encode the outgoing message and decode the response.
	 *
	 * @defaultValue 'utf8'
	 * @remarks The accepted values are `'utf8'` or `'utf-8'` (normalized to `'utf8'`).
	 */
	encoding?: 'utf8' | 'utf-8';
}

/**
 * Error object shape for socket-level failures. Extends the standard {@link Error}
 * with common Node.js errno-style fields when available.
 *
 * @public
 */
export interface TcpError extends Error {
	/**
	 * Optional string error code (e.g., `'ECONNREFUSED'`, `'ETIMEDOUT'`, `'EPIPE'`).
	 */
	code?: string;
	
	/**
	 * Optional numeric errno associated with low-level system errors.
	 */
	errno?: number;
	
	/**
	 * The system call that failed, when available (e.g., `'connect'`, `'read'`, `'write'`).
	 */
	syscall?: string;
	
	/**
	 * Related filesystem/IPC path when applicable (usually `undefined` for TCP).
	 */
	path?: string;
}
