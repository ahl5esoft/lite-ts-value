import { ValueTypeData } from './value-type-data';
import { ValueTypeUpgrade } from './value-type-upgrade';

export function valueTypeUpgradeReduce(memo: ValueTypeUpgrade, r: ValueTypeData) {
    if (r.upgrade?.valueType)
        memo[r.value] = r.upgrade.valueType;

    return memo;
}