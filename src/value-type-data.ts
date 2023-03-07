import moment from 'moment';

import { IEnumItem } from './i-enum-factory';

export class ValueTypeData implements IEnumItem {
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
    }
    public isNegative: boolean;
    public isReplace: boolean;
    public value: number;
    public text: string;
    public range: {
        max: number;
        min: number;
    };
    public sync: {
        valueTypes: number[];
    };
    public time: {
        valueType: number;
        momentType: moment.unitOfTime.StartOf;
    };
}