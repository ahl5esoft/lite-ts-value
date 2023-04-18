import { Value } from './value';
import { ValueTypeData } from './value-type-data';

export interface IValueObserver {
    predicate(valueTypeData: ValueTypeData): Promise<boolean>;
    notify(value: Value): Promise<boolean | void>;
}