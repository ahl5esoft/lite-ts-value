import moment from 'moment';

import { IEnumItem } from './i-enum-factory';

export class ValueTypeData implements IEnumItem {
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