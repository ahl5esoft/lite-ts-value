import { IValueObserver } from './i-value-observer';
import { InterceptorMetadata } from './interceptor-metadata';
import { ValueInterceptorHandlerBase } from './value-interceptor-handler-base';
import { ValueTypeData } from './value-type-data';

export function ValueBeforeIntercept(valueType: number): (ctor: new () => IValueObserver<boolean>) => void;
export function ValueBeforeIntercept(predicate: (valueType: ValueTypeData) => boolean): (ctor: new () => IValueObserver<boolean>) => void;
export function ValueBeforeIntercept(valueTypeOrPredicate: number | ((valueType: ValueTypeData) => boolean)) {
    return ValueInterceptorHandlerBase.register(ValueInterceptorBeforeHandler, valueTypeOrPredicate);
}

export class ValueInterceptorBeforeHandler extends ValueInterceptorHandlerBase {
    public static metadata: InterceptorMetadata = {
        predicates: [],
        valueType: {}
    };

    protected get metadata() {
        return ValueInterceptorBeforeHandler.metadata;
    }
}