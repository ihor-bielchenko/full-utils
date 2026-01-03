import { rangeIPv4 } from './rangeIPv4';
import { rangeIPv4ToArr } from './rangeIPv4ToArr';

export interface RangeIPv4Options {
	limit?: number;
	includeNetwork?: boolean;
	includeBroadcast?: boolean;
}
