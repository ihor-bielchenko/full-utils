import { 
	isStrBool,
	isStr, 
	jsonDecode,
	formatToBool,
	formatToNum,
} from '../index';

/**
 * A narrow union describing which quoting characters are recognized by the parser.
 *
 * @remarks
 * The parser treats both single quotes (`'`) and double quotes (`"`) as valid string
 * delimiters. When inside a quoted segment, commas are not considered separators,
 * and typical backslash escapes are honored (e.g., `\"`, `\'`, `\\`).
 *
 * @public
 * @since 2.0.0
 */
type Quote = "'" | '"' | null;

/**
 * Parse a human-typed string of function-like arguments into a normalized array of JS values.
 *
 * @summary
 * Splits by **top-level commas** (ignoring commas that appear inside quotes, parentheses,
 * brackets, or braces) and **coerces** each token to a sensible JavaScript type:
 * `null`, `undefined`, booleans, numbers (including `Infinity`/`-Infinity`), strings
 * (with quote stripping and unescaping), and JSON objects/arrays. Tokens that look like
 * a macro or call marker (start with `$` and end with `)`) are returned **as is**.
 *
 * @remarks
 * ### How parsing works
 * 1. **Input normalization**
 *    - Non-string inputs are returned as a single-element array `[value]`.
 *    - Leading/trailing whitespace is trimmed.
 *    - If the entire string is wrapped in square brackets (`[...]`), the brackets are
 *      removed (so the function accepts both `a,b,c` and `[a, b, c]`).
 *    - Empty input (after trimming or after removing `[...]`) yields `[]`.
 *
 * 2. **Tokenization by top-level commas**
 *    - The string is scanned left-to-right.
 *    - The parser tracks nesting **depth** for `()`, `[]`, `{}` and whether it is
 *      currently **inside quotes**. A comma only splits tokens at **depth 0** and
 *      **outside quotes**.
 *
 * 3. **Per-token coercion (in this order)**
 *    - **Macro / call marker**: If a token starts with `$`, contains `(`, and ends
 *      with `)`, it is returned unchanged (e.g., `"$env(PATH)"`).
 *    - **Literals**: `null` → `null`, `undefined` → `undefined`.
 *    - **Booleans**: Using {@link isStrBool} + {@link formatToBool} (e.g., `"true"`,
 *      `"False"`, `"yes"`, `"0"` depending on your implementation).
 *    - **Numbers**: Using {@link formatToNum}. If the result is finite, it is returned.
 *      Explicit `"Infinity"` and `"-Infinity"` are also supported.
 *    - **Quoted strings**: `'text'` or `"text"` → inner text with escapes processed
 *      (`\\` → `\`, `\'` → `'`, `\"` → `"`).
 *    - **JSON**: If token begins with `{` and ends with `}`, or begins with `[` and
 *      ends with `]`, the function attempts `jsonDecode`. On failure, the raw string
 *      is returned.
 *    - **Fallback**: Raw token as string.
 *
 * ### Escaping inside quotes
 * - Backslash escaping is supported while inside quotes:
 *   - `\\` for a literal backslash
 *   - `\"` inside double quotes
 *   - `\'` inside single quotes
 *
 * ### Non-throwing behavior
 * - The function aims to be **robust** and **non-throwing**. Invalid JSON will be
 *   returned as a plain string rather than crashing.
 *
 * ### Security considerations
 * - The parser **does not** evaluate code; it only returns strings or parsed values.
 *   If you plan to execute anything returned (e.g., tokens starting with `$...`),
 *   do so in a sandbox with explicit allow-lists.
 *
 * ### Limitations
 * - Numerical parsing relies on {@link formatToNum}. Extremely large or high-precision
 *   decimals may still be subject to JavaScript `number` precision limits unless your
 *   `formatToNum` converts to a safer representation.
 * - Only basic backslash escapes are handled in quoted strings (no `\uXXXX` decoding here).
 * - Whitespace outside quotes is trimmed from each token; internal whitespace is preserved.
 *
 * @example
 * // Basic values
 * formatStrToFuncArgsArr('1, true, "hello"'); // => [1, true, "hello"]
 *
 * @example
 * // Bracket-wrapped list
 * formatStrToFuncArgsArr('[1, 2, 3]'); // => [1, 2, 3]
 *
 * @example
 * // Nested structures and quoting
 * formatStrToFuncArgsArr('{"a":1,"b":[2,3]}, "te,xt", (x,y)'); // => [ {a:1,b:[2,3]}, "te,xt", "(x,y)" ]
 *
 * @example
 * // Booleans, null/undefined, and Infinity
 * formatStrToFuncArgsArr('yes, NO, null, undefined, Infinity, -Infinity');
 * // => [true, false, null, undefined, Infinity, -Infinity]
 *
 * @example
 * // Macro-like token (returned as-is)
 * formatStrToFuncArgsArr('$env(PATH)'); // => ["$env(PATH)"]
 *
 * @example
 * // Escapes inside quotes
 * formatStrToFuncArgsArr('"He said: \\"Hi\\"", \'It\\\'s ok\', "\\\\path"');
 * // => ['He said: "Hi"', "It's ok", "\\path"]
 *
 * @example
 * // Empty and whitespace inputs
 * formatStrToFuncArgsArr('   ');          // => []
 * formatStrToFuncArgsArr('[]');           // => []
 * formatStrToFuncArgsArr('[   ]');        // => []
 * formatStrToFuncArgsArr('  [ a , b ] '); // => ["a", "b"]
 *
 * @param value - Raw string containing comma-separated arguments.
 * If `value` is **not** a string, the function returns `[value]` unchanged.
 *
 * @returns An array of coerced values (`unknown[]`). Each item is one parsed token.
 *
 * @see isStrBool
 * @see formatToBool
 * @see formatToNum
 * @see jsonDecode
 *
 * @public
 * @since 2.0.0
 */
export function formatStrToFuncArgsArr(value: string): unknown[] {
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
			return formatToBool(raw);
		}
		const n = formatToNum(raw as any);
		
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
				return jsonDecode(rawStr);
			} 
			catch {
			}
		}
		return rawStr;
	});
}
