import { 
	isStr,
	strTrim, 
} from '../index';

export const strNormalize = (v: unknown) => {
	if (!isStr(v)) {
		return v;
	}
	const t = String(strTrim(v) || '');
	
	return t === '' 
		? null 
		: String(t.toLowerCase() || '').replace(/\s+/g, ' ').replace(/\t+/g, '').replace(/\n+/g,'');
};
