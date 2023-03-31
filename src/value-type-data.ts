import { EnumItem } from 'lite-ts-enum';
import moment from 'moment';
import { Reward } from './reward';

export class ValueTypeData extends EnumItem {
    public static ctor = 'ValueTypeData';

    /**
     * 自动恢复类型
     */
    public autoRecovery: {
        /**
         * 倒计时数值
         */
        countdownOnValueType: number,
        /**
         * 恢复间隔
         */
        interval: number;
        /**
         * 最大限制数值
         */
        limitValueType: number,
    };
    public expiration: {
        valueType: number;
        expirationOn: number;
    };
    public isNegative: boolean;
    public isReplace: boolean;
    public value: number;
    public text: string;
    public range: {
        max: number;
        min: number;
    };
    public reward: {
        addition: {
            childValueType: number;
            mainValueType: number;
        };
        open: Reward[][];
    };
    public sync: {
        absValeuTypes: number[];
        valueTypes: number[];
    };
    public time: {
        valueType: number;
        momentType: moment.unitOfTime.StartOf;
    };

    /**
     * 升级数值
     */
    public upgrade: {
        valueType: number;
    };
}