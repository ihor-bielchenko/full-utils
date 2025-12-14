
type AnyObj = Record<string, any>;

function isPlainObject(v: any): v is AnyObj {
	return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function isReplaceLeafTemplate(v: any): boolean {
	return v === null || v === undefined || typeof v !== 'object' || v instanceof Date;
}

function replaceLeafKeepingShape(current: any, replacement: any) {
	if (Array.isArray(current)) {
		return Array.isArray(replacement) ? replacement : [ replacement ];
	}
	return replacement;
}

function applyTemplate(current: any, template: any): any {
	if (current == null) {
		return current;
	}
	if (isReplaceLeafTemplate(template)) {
		return replaceLeafKeepingShape(current, template);
	}
	if (Array.isArray(current)) {
		return current.map((item) => applyTemplate(item, template));
	}
	if (!isPlainObject(current) || !isPlainObject(template)) {
		return current;
	}
	const out: AnyObj = { ...current };
	let changed = false;

	for (const key of Object.keys(template)) {
		if (!(key in current)) {
			continue;
		}
		const next = applyTemplate(current[key], template[key]);

		if (next !== current[key]) {
			out[key] = next;
			changed = true;
		}
	}

	return changed ? out : current;
}

export function arrReplaceTemplate<T>(where: T, template: AnyObj): T {
	return applyTemplate(where, template) as T;
}
