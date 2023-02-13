import { IValue } from './i-value';
import { IValueCondition } from './i-value-condition';

export interface IValueService {
    checkConditions(conditions: IValueCondition[][]): Promise<boolean>;
    checkEnough(times: number, values: IValue[]): Promise<boolean>;
    getCount(valueType: number): Promise<number>;
    tryCheckEnough(times: number, values: IValue[]): Promise<void>;
    update(values: IValue[]): Promise<void>;
}