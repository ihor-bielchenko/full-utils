
export interface NetTCPOptions {
	port?: number;
	timeoutMs?: number;
	signal?: AbortSignal;
	maxBytes?: number;
	halfCloseAfterWrite?: boolean;
	lineTerminator?: '' | '\n' | '\r\n';
	connectTimeoutMs?: number;
	encoding?: 'utf8' | 'utf-8';
}

export interface TcpError extends Error {
	code?: string;
	errno?: number;
	syscall?: string;
	path?: string;
}
