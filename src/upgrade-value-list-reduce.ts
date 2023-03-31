import { UpgradeData } from './upgrade-data';
import { UpgradeValueList } from './upgrade-value-list';

export function upgradeValueReduce(memo: UpgradeValueList, r: UpgradeData) {
    if (r.list)
        memo[r.value] = r.list;

    return memo;
}