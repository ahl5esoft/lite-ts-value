import { EnumItem } from 'lite-ts-enum';

import { Reward } from './reward';
import { Value } from './value';
import { ValueCondition } from './value-service';

export class UpgradeData extends EnumItem {
    public static ctor = 'UpgradeData';
    /**
     * 升级配置
     */
    public list: {
        [level: number]: {
            /**
             * 条件
             */
            condition: ValueCondition[][];
            /**
             * 消耗
             */
            consumeValues: Value[];
            /**
             * 奖励
             */
            rewards: Reward[][];
        };
    };

    /**
     * 编号(数值类型)
     */
    public value: number;
}