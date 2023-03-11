import { ValueTypeData } from './value-type-data';
import { ValueTypeRewardAddition } from './value-type-reward-addition';

export function valueTypeRewardAdditionReduce(memo: ValueTypeRewardAddition, r: ValueTypeData) {
    if (r.reward?.addition) {
        memo[r.reward.addition.mainValueType] ??= {};
        memo[r.reward.addition.mainValueType][r.reward.addition.childValueType] = r.value;
    }

    return memo;
}