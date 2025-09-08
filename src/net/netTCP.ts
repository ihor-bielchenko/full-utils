import * as net from 'net';

export interface NetTCPOptions {
	port?: number;
	timeoutMs?: number;
	encoding?: BufferEncoding;
}

export function netTCP(
	message: string,
	ipaddr: string,
	{
		port = 4028,
		timeoutMs = 0,
		encoding = 'utf-8',
	}: NetTCPOptions = {}
): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		const socket = new net.Socket();
		const cleanup = () => {
			socket.removeAllListeners();
			
			if (!socket.destroyed) {
				socket.destroy();
			}
		};
		let output = '',
			settled = false;

		if (timeoutMs && timeoutMs > 0) {
			socket.setTimeout(timeoutMs);
			socket.once('timeout', () => {
				if (settled) {
					return;
				}
				settled = true;
				
				cleanup();
				reject(new Error('ECONNABORTED'));
			});
		}
		socket.setEncoding(encoding);
		socket.once('connect', () => {
			socket.write(message);
		});
		socket.on('data', (chunk: string) => {
			output += chunk;
		});
		socket.once('end', () => {
			if (settled) {
				return;
			}
			settled = true;
			
			cleanup();
			resolve(output);
		});
		socket.once('error', (err) => {
			if (settled) {
				return;
			}
			settled = true;
			
			cleanup();
			reject(err);
		});
		socket.connect({ host: ipaddr, port });
	});
}
