import { Reward } from './reward';
import { Value } from './value';
import { ValueCondition } from './value-service';

export class UpgradeValueList {
    [valueType: number]: {
        condition: ValueCondition[][];
        consumeValues: Value[];
        rewards: Reward[][];
    }[];
}