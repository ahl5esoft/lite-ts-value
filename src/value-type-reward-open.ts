import { Reward } from './reward';

export class ValueTypeRewardOpen {
    public static ctor = 'ValueTypeOpenRewards';

    [valueType: number]: Reward[][];
}