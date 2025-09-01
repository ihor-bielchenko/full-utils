import { isArrFilled } from '../is/isArrFilled';
import { isArr } from '../is/isArr';
import { isStrBool } from '../is/isStrBool';
import { isBool } from '../is/isBool';
import { isExists } from '../is/isExists';
import { toBool } from './toBool';

export function toSqlUpdateMany(d: Array<any>): string {
	let c = '',
		p = {},
		r = [];

	for (c in d[0]) {
		if (c !== 'id') {
			p[c] = [];
		}
	}
	d.forEach((e) => {
		let c = '';

		for (c in e) {
			if (isArr(p[c])) {
				let then: any = `"${e[c]}"`;

				if (isBool(e[c]) || isStrBool(e[c])) {
					then = Number(toBool(e[c]));
				}
				if (!isExists(e[c])) {
					then = 'NULL';
				}
				p[c].push(`WHEN "${e.id}" THEN ${then}`);
			}
		}
	});

	for (c in d[0]) {
		if (isArrFilled(p[c])) {
			r.push(`${c} = CASE id ${p[c].join(' ')} END`);
		}
	}
	return r.join(',');
}
