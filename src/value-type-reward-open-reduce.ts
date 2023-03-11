import { ValueTypeData } from './value-type-data';
import { ValueTypeRewardOpen } from './value-type-reward-open';

export function valueTypeRewardOpenReduce(memo: ValueTypeRewardOpen, r: ValueTypeData) {
    if (r.reward?.open)
        memo[r.value] = r.reward?.open;

    return memo;
}