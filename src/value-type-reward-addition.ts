export class ValueTypeRewardAddition {
    public static ctor = 'ValueTypeRewardAddition';

    [mainValueType: number]: {
        [childValueType: number]: number;
    };
}