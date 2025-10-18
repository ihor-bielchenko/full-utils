import type { 
	NetTCPOptions,
	TcpError, 
} from './types';
import { isStrFilled } from '../is/isStrFilled';
import { isNumP } from '../is/isNumP';
import { isFunc } from '../is/isFunc';
import { err } from './err';

let netMod: any = null;

/**
 * Open a TCP connection to a host, send a text payload, and return the server’s response as a string.
 *
 * @param message - The request body to send. If `lineTerminator` is set, it is appended automatically.
 * @param host - Hostname or IP address to connect to.
 * @param options - Behavior and safety knobs for the connection, timeouts, encoding, and buffering.
 * @param options.port - Remote TCP port. {@defaultValue 4028}
 * @param options.timeoutMs - Idle timeout after connect/read in milliseconds. {@defaultValue 0}
 * @param options.signal - AbortSignal for cooperative cancellation.
 * @param options.maxBytes - Maximum response size in bytes; 0 means unlimited. {@defaultValue 0}
 * @param options.halfCloseAfterWrite - Call `socket.end()` after writing the request. {@defaultValue false}
 * @param options.lineTerminator - Optional `'\n'` / `'\r\n'` suffix to append. {@defaultValue ''}
 * @param options.connectTimeoutMs - Timeout for establishing the connection. {@defaultValue 0}
 * @param options.encoding - `'utf8'` or `'utf-8'` used for I/O. {@defaultValue 'utf8'}
 *
 * @returns A promise that resolves to the full response string (decoded using `encoding`).
 *
 * @throws {Error} ENODEONLY
 * Thrown when executed in a non-Node.js environment (e.g., a browser).
 *
 * @throws {Error} EBADHOST
 * Thrown when `host` is not a non-empty string.
 *
 * @throws {Error} EBADMSG
 * Thrown when `message` is not a non-empty string.
 *
 * @throws {Error} EBADPORT
 * Thrown when `port` is outside the range 1–65535 or not an integer.
 *
 * @throws {Error} ENETIMPORT
 * Thrown if dynamic import of the `node:net` module fails.
 *
 * @throws {Error} EABORT
 * Thrown if the provided {@link AbortSignal} is already aborted or aborts during the operation.
 *
 * @throws {Error} ETIMEDOUT
 * Thrown in these cases:
 * - `"Connect timed out"`: connect phase exceeded `connectTimeoutMs`.
 * - `"Idle timeout"`: no data within `timeoutMs` after connection.
 *
 * @throws {Error} ERESPONSE_TOO_LARGE
 * Thrown when the accumulated response exceeds `maxBytes`.
 *
 * @throws {TcpError}
 * Any socket `'error'` event is forwarded (e.g., `ECONNREFUSED`, `ENOTFOUND`, `EPIPE`).
 *
 * @remarks
 * - **Lifecycle:** The socket’s listeners are cleaned up and the socket destroyed on settle.
 * - **Close semantics:** If the socket emits `'close'` with `hadError=true`, the promise rejects with `ECLOSE`.
 * - **Performance:** If you expect large responses, set a realistic `maxBytes` to avoid excessive memory usage.
 * - **Protocols:** For request/response style text protocols (e.g., simple line-based services), set
 *   `lineTerminator` (e.g., `'\n'`) and optionally `halfCloseAfterWrite=true` if the server expects EOF to start responding.
 *
 * @example
 * ```ts
 * // CRLF-terminated request with half-close to signal EOF
 * const resp = await netTCP('STATUS', '192.0.2.10', {
 *   port: 9000,
 *   lineTerminator: '\r\n',
 *   halfCloseAfterWrite: true,
 *   timeoutMs: 3000,
 *   maxBytes: 256 * 1024, // 256 KiB cap
 * });
 * console.log(resp);
 * ```
 *
 * @see AbortSignal
 * @see https://nodejs.org/api/net.html Node.js net module
 * @since 2.0.0
 */
export async function netTCP(
	message: string,
	host: string,
	{
		port = 4028,
		timeoutMs = 0,
		connectTimeoutMs = 0,
		encoding = 'utf8',
		signal,
		maxBytes = 0,
		halfCloseAfterWrite = false,
		lineTerminator = '',
	}: NetTCPOptions = {}
): Promise<string> {
	const isNode = typeof process !== 'undefined' && !!process.versions?.node;
	
	if (!isNode) {
		throw err('ENODEONLY', 'connectTCP is Node-only');
	}
	if (!isStrFilled(host)) {
		throw err('EBADHOST', '`host` must be a non-empty string');
	}
	if (!isStrFilled(message)) {
		throw err('EBADMSG', '`message` must be a non-empty string');
	}
	if (!isNumP(port) || port < 1 || port > 65535) {
		throw err('EBADPORT', '`port` must be an integer in range 1..65535');
	}
	const enc = (encoding as string).toLowerCase() === 'utf-8' ? 'utf8' : encoding;

	if (!netMod) {
		try { 
			netMod = await import('node:net'); 
		} 
		catch {
		}
	}
	if (!netMod) {
		throw err('ENETIMPORT', 'FATAL: node:net import failed');
	}
	return new Promise<string>((resolve, reject) => {
		const socket = new netMod!.Socket();
		let settled = false;
		let totalBytes = 0;
		let connectTimer: ReturnType<typeof setTimeout> | null = null;

		const onAbort = () => {
			if (!socket.destroyed) {
				socket.destroy(err('EABORT', 'Operation cancelled') as any);
			}
			finalize(err('EABORT', 'Operation cancelled'));
		};

		const finalize = (err?: unknown, value?: string) => {
			if (settled) {
				return;
			}
			settled = true;
			socket.removeAllListeners();
			
			if (signal) {
				signal.removeEventListener('abort', onAbort);
			}
			if (!socket.destroyed) {
				socket.destroy();
			}
			if (connectTimer) {
				clearTimeout(connectTimer);
			}
			if (err) {
				reject(err);
			}
			else {
				resolve(value ?? '');
			}
		};

		if (signal) {
			if (signal.aborted) {
				return finalize(err('EABORT', 'Operation cancelled'));
			}
			signal.addEventListener('abort', onAbort, { once: true });
		}
		if (isNumP(connectTimeoutMs)) {
			connectTimer = setTimeout(() => finalize(err('ETIMEDOUT', 'Connect timed out')), connectTimeoutMs);
			
			if (connectTimer && isFunc((connectTimer as any).unref)) {
				(connectTimer as any).unref();
			}
		}
		if (isNumP(timeoutMs)) {
			socket.setTimeout(timeoutMs);
			socket.once('timeout', () => finalize(err('ETIMEDOUT', 'Idle timeout')));
		}
		const chunks: Buffer[] = [];

		socket.on('data', (chunk: Buffer | string) => {
			if (settled) {
				return;
			}
			const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, enc);

			if (isNumP(maxBytes) && (totalBytes + buf.length) > maxBytes) {
				return finalize(err('ERESPONSE_TOO_LARGE', 'Response exceeds maxBytes'));
			}
			chunks.push(buf);
			totalBytes += buf.length;
		});
		socket.once('end', () => {
			if (settled) {
				return;
			}
			const out: any = Buffer.concat(chunks, totalBytes).toString(enc);
			
			finalize(undefined, out);
		});
		socket.once('close', (hadError: any) => {
			if (settled) {
				return;
			}
			const out: any = Buffer.concat(chunks, totalBytes).toString(enc);
			
			if (hadError) {
				finalize(err('ECLOSE', 'Socket closed with error'));
			}
			else {
				finalize(undefined, out);
			}
		});
		socket.once('error', (err: TcpError) => {
			if (settled) {
				return;
			}
			finalize(err);
		});
		socket.once('connect', () => {
			if (connectTimer) { 
				clearTimeout(connectTimer); 
				connectTimer = null; 
			}
			const payload = lineTerminator ? (message + lineTerminator) : message;
			const ok = socket.write(payload, enc);
			
			if (!ok) {
				socket.once('drain', () => { 
					if (halfCloseAfterWrite && !settled) {
						socket.end();
					} 
				});
			}
			else if (halfCloseAfterWrite) {
				socket.end();
			}
		});
		socket.connect({ host, port });
	});
}
