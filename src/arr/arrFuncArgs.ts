import { 
	isStrBool,
	isStr, 
	boolNormalize,
	numNormalize,
} from '../index';

type Quote = "'" | '"' | null;

export function arrFuncArgs(value: string): unknown[] {
	if (!isStr(value)) {
		return [value];
	}
	let src = value.trim();
	
	if (src === '') {
		return [];
	}
	if (src.startsWith('[') && src.endsWith(']')) {
		src = src.slice(1, -1).trim();
		
		if (src === '') {
			return [];
		}
	}
	let buf = '',
		inQuote = false,
		quoteChar: Quote = null,
		esc = false,
		depthParen = 0,
		depthBracket = 0,
		depthBrace = 0;

	const items: string[] = [];
	const finalize = () => {
		const trimmed = buf.trim();
		
		if (trimmed !== '') {
			items.push(trimmed);
		}
		buf = '';
	};

	for (let i = 0; i < src.length; i++) {
		const ch = src[i];

		if (inQuote) {
			buf += ch;

			if (esc) { 
				esc = false; 
				continue; 
			}
			if (ch === '\\') { 
				esc = true; 
				continue; 
			}
			if (ch === quoteChar) {
				inQuote = false;
				quoteChar = null;
			}
			continue;
		}
		if (ch === '"' || ch === "'") {
			inQuote = true;
			quoteChar = ch as Quote;
			buf += ch;
			
			continue;
		}
		if (ch === '(') { 
			depthParen++; 
			buf += ch; 

			continue; 
		}
		if (ch === ')') { 
			depthParen = Math.max(0, depthParen - 1); 
			buf += ch; 
			
			continue; 
		}
		if (ch === '[') { 
			depthBracket++; 
			buf += ch; 
			
			continue; 
		}
		if (ch === ']') { 
			depthBracket = Math.max(0, depthBracket - 1); 
			buf += ch; 
			
			continue; 
		}
		if (ch === '{') { 
			depthBrace++; 
			buf += ch; 
			
			continue; 
		}
		if (ch === '}') { 
			depthBrace = Math.max(0, depthBrace - 1); 
			buf += ch; 

			continue; 
		}
		if (ch === ',' && depthParen === 0 && depthBracket === 0 && depthBrace === 0) {
			finalize();
			
			continue;
		}
		buf += ch;
	}
	if (buf.length) {
		finalize();
	}
	return items.map((raw: string): unknown => {
		if (raw.startsWith('$') && raw.includes('(') && raw.endsWith(')')) {
			return raw;
		}
		if (raw === 'null') {
			return null;
		}
		if (raw === 'undefined') {
			return undefined;
		}
		if (isStrBool(raw)) {
			return boolNormalize(raw);
		}
		const n = numNormalize(raw as any);
		
		if (Number.isFinite(n)) {
			return n;
		}		
		if (raw === 'Infinity') {
			return Infinity;
		}
		if (raw === '-Infinity') {
			return -Infinity;
		}
		const rawStr: string = String(raw || '');
		const hasQuotes = rawStr.length >= 2
			&& ((rawStr.startsWith("'") && rawStr.endsWith("'")) 
				|| (rawStr.startsWith('"') && rawStr.endsWith('"')));

		if (hasQuotes) {
			return rawStr
				.slice(1, -1)
				.replace(/\\\\/g, '\\')
				.replace(/\\'/g, "'")
				.replace(/\\"/g, '"');
		}
		if ((rawStr.startsWith('{') && rawStr.endsWith('}')) || (rawStr.startsWith('[') && rawStr.endsWith(']'))) {
			try {
				return JSON.parse(rawStr);
			} 
			catch {
			}
		}
		return rawStr;
	});
}
