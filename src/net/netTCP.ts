const net = require('net');

import { v4 as uuidv4 } from 'uuid';

const _tcpRequestTimers = {};

export async function netTCP(message: string, ipaddr: string, timeout: number = 0): Promise<string> {
	const socketClient = new net.Socket();
		
	return await (new Promise((resolve, reject) => {
		const id = uuidv4();
		let output = '';

		socketClient.connect(4028, ipaddr, () => socketClient.write(message));
		socketClient.on('connect', () => {
		});
		socketClient.on('data', (data) => {
			output += data.toString();
		});
		socketClient.on('close', () => {
			socketClient.end();
			clearTimeout(_tcpRequestTimers[id]);
			delete _tcpRequestTimers[id];
			return resolve(output);
		});
		socketClient.on('error', (err) => {
			socketClient.end();
			clearTimeout(_tcpRequestTimers[id]);
			delete _tcpRequestTimers[id];
			return reject(err);
		});

		_tcpRequestTimers[id] = setTimeout(() => {
			socketClient.end();

			delete _tcpRequestTimers[id];
			return reject(new Error('ECONNABORTED'));
		}, timeout);
	}));
}
