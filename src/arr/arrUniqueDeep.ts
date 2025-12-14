export type JsonLike =
	| null
	| boolean
	| number
	| string
	| undefined
	| bigint
	| Date
	| JsonLike[]
	| { [key: string]: JsonLike };

export interface UniqueDeepOptions<T = unknown> {
	keyFn?: (item: T) => string;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
	return v !== null && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date);
}

function stableStringify(value: unknown): string {
	const seen = new WeakSet<object>();
	const inner = (v: unknown): string => {
		if (v === null) {
			return 'null';
		}
		const t = typeof v;

		if (t === 'string') {
			return JSON.stringify(v);
		}
		if (t === 'number') {
			return Number.isNaN(v) ? '"__NaN__"' : String(v);
		}
		if (t === 'boolean') {
			return v ? 'true' : 'false';
		}
		if (t === 'undefined') {
			return '"__undefined__"';
		}
		if (t === 'bigint') {
			return `"__bigint__:${String(v)}"`;
		}
		if (t === 'function') {
			return `"__function__"`;
		}
		if (v instanceof Date) {
			return `"__date__:${v.toISOString()}"`;
		}
		if (Array.isArray(v)) {
			return '[' + v.map(inner).join(',') + ']';
		}
		if (t === 'object' && v) {
			const obj = v as Record<string, unknown>;
			
			if (seen.has(obj)) {
				return '"__circular__"';
			}
			seen.add(obj);

			const keys = Object.keys(obj).sort();
			const props = keys.map((k) => JSON.stringify(k) + ':' + inner(obj[k]));
			
			return '{' + props.join(',') + '}';
		}
		return JSON.stringify(String(v));
	};

	return inner(value);
}

function defaultKeyFn(item: unknown): string {
	if (item === null) {
		return 'null';
	}
	const t = typeof item;

	if (t === 'string') {
		return 's:' + item;
	}
	if (t === 'number') {
		return 'n:' + (Number.isNaN(item) ? '__NaN__' : item);
	}
	if (t === 'boolean') {
		return 'b:' + item;
	}
	if (t === 'undefined') {
		return 'u:';
	}
	if (t === 'bigint') {
		return 'bi:' + String(item);
	}
	if (item instanceof Date) {
		return 'd:' + item.toISOString();
	}
	return 'o:' + stableStringify(item);
}

export function arrUniqueDeep<T>(input: T, opts?: UniqueDeepOptions<unknown>): T {
	const keyFn = opts?.keyFn ?? defaultKeyFn;
	const walk = (node: unknown): unknown => {
		if (Array.isArray(node)) {
			const processed = node.map(walk);

			const seen = new Set<string>();
			const out: unknown[] = [];

			for (const item of processed) {
				const key = keyFn(item);
				if (seen.has(key)) {
					continue;
				}
				seen.add(key);
				out.push(item);
			}
			return out;
		}
		if (isPlainObject(node)) {
			const out: Record<string, unknown> = {};
			for (const k of Object.keys(node)) {
				out[k] = walk(node[k]);
			}
			return out;
		}
		return node;
	};

	return walk(input) as T;
}
