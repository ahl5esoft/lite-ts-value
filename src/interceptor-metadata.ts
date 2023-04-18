import { IValueObserver } from './i-value-observer';
import { ValueTypeData } from './value-type-data';

export type InterceptorMetadata = {
    predicates: {
        ctor: new () => IValueObserver<any>;
        predicate: (valueType: ValueTypeData) => boolean;
    }[];
    valueType: {
        [valueType: number]: new () => IValueObserver<any>;
    };
};