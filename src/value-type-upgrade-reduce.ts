import { ValueTypeData } from './value-type-data';
import { ValueTypeUpgrade } from './value-type-upgrade';

export function valueTypeUpgradeReduce(memo: ValueTypeUpgrade, r: ValueTypeData) {
    if (r.upgradeValueType)
        memo[r.value] = r.upgradeValueType;

    return memo;
}