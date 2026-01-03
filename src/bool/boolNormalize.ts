import { 
	isBool,
	isNumP, 
	isNumNZ,
	isStrFilled,
} from '../index';

export function boolNormalize(value: unknown): boolean {
	switch (true) {
		case isBool(value):
			return value;

		case isNumP(value):
			return true;

		case isNumNZ(value):
			return false;

		case isStrFilled(value) && [ 'true', '1', 'yes', 'on' ].includes(String(value ?? '').trim().toLowerCase()):
			return true;

		case isStrFilled(value) && [ 'false', '0', 'no', 'off' ].includes(String(value ?? '').trim().toLowerCase()):
			return false;
	}
	return false;
}
