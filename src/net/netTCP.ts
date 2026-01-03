import type { 
	NetTCPOptions,
	TcpError, 
} from '../node';
import { 
	isStrFilled,
	isNumP,
	isFunc, 
} from '../index';
import { err } from './err';

let netMod: any = null;

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
