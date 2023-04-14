import { IValueInterceptor } from './value-interceptor-handler-base';
import { ValueTypeData } from './value-type-data';

export type InterceptorMetadata = {
    predicates: {
        ctor: new () => IValueInterceptor<any>;
        predicate: (valueType: ValueTypeData) => boolean;
    }[];
    valueType: {
        [valueType: number]: new () => IValueInterceptor<any>;
    };
};