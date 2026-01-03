import type { TcpError } from '../node';

export function err(code: string, message?: string): TcpError {
	const e = new Error(message ?? code) as TcpError;
	
	e.code = code;
	
	return e;
}
