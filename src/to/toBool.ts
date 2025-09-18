import { isBool } from '../is/isBool';
import { isNumP } from '../is/isNumP';
import { isNumNZ } from '../is/isNumNZ';
import { isStrFilled } from '../is/isStrFilled';

export function toBool(value: unknown): boolean {
	switch (true) {
		case isBool(value):
			return value;

		case isNumP(value):
			return true;

		case isNumNZ(value):
			return false;

		case isStrFilled(value) && [ 'true', '1', 'yes', 'on' ].includes(value.trim().toLowerCase()):
			return true;

		case isStrFilled(value) && [ 'false', '0', 'no', 'off' ].includes(value.trim().toLowerCase()):
			return false;
	}
	return false;
}
