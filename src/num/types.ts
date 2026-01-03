import {
	parseToFixedDecimal,
	roundFixedDecimal,
	fixedDecimalToStr,
	fixedDecimalToNum,
} from '../index';

export interface FixedDecimal {
	sign: 1 | -1;
	digitsInteger: bigint;
	scale: number;
}
