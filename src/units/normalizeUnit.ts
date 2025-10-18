
export function normalizeUnit(u: string): string {
	return String(u)
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '')
		.replace(/(?:\/?s|hash(?:es)?)$/i, '');
}
