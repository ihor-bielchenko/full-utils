import type { FixedDecimal } from './types';
import { fixedDecimalToStr } from './fixedDecimalToStr';

export function fixedDecimalToNum(value: FixedDecimal): number {
	return Number(fixedDecimalToStr(value));
}
