import { IValue } from './i-value';

export interface IValueCondition extends IValue {
    op: string;
}