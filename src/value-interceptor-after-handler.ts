import { IValueObserver } from './i-value-observer';
import { InterceptorMetadata } from './interceptor-metadata';
import { ValueInterceptorHandlerBase } from './value-interceptor-handler-base';
import { ValueTypeData } from './value-type-data';

export function ValueAfterIntercept(valueType: number): (ctor: new () => IValueObserver<any>) => void;
export function ValueAfterIntercept(predicate: (valueType: ValueTypeData) => boolean): (ctor: new () => IValueObserver<any>) => void;
export function ValueAfterIntercept(valueTypeOrPredicate: number | ((valueType: ValueTypeData) => boolean)) {
    return ValueInterceptorHandlerBase.register(ValueInterceptorAfterHandler, valueTypeOrPredicate);
}

export class ValueInterceptorAfterHandler extends ValueInterceptorHandlerBase {
    public static metadata: InterceptorMetadata = {
        predicates: [],
        valueType: {}
    };

    protected get metadata() {
        return ValueInterceptorAfterHandler.metadata;
    }
}