import { InterceptorMetadata } from './interceptor-metadata';
import { IValueInterceptor, ValueInterceptorHandlerBase } from './value-interceptor-handler-base';
import { ValueTypeData } from './value-type-data';

export function ValueAfterIntercept(valueType: number): (ctor: new () => IValueInterceptor<any>) => void;
export function ValueAfterIntercept(predicate: (valueType: ValueTypeData) => boolean): (ctor: new () => IValueInterceptor<any>) => void;
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