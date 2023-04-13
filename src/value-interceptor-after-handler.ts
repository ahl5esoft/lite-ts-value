import { IValueInterceptor, ValueInterceptorHandlerBase } from './value-interceptor-handler-base';
import { ValueTypeData } from './value-type-data';

/**
 * 数值拦截器
 * 
 * @param valueType 数值类型
 */
export function ValueAfterIntercept(valueType: number): (ctor: new () => IValueInterceptor<any>) => void;

/**
 * 数值拦截器
 * 
 * @param predicate 断言
 */
export function ValueAfterIntercept(predicate: (valueType: ValueTypeData) => boolean): (ctor: new () => IValueInterceptor<any>) => void;

/**
 * 数值拦截装饰器
 * 
 * @param any 数值类型或断言
 */
export function ValueAfterIntercept(any: number | ((valueType: ValueTypeData) => boolean)) {
    return (ctor: new () => IValueInterceptor<any>) => {
        if (typeof any == 'number') {
            ValueInterceptorAfterHandler.metadata.valueType[any] = ctor;
        } else {
            ValueInterceptorAfterHandler.metadata.predicates.push({
                ctor,
                predicate: any,
            });
        }
    };
}

export class ValueInterceptorAfterHandler extends ValueInterceptorHandlerBase {

    /**
     * 更新数值拦截元数据
     */
    public static metadata = {
        predicates: [],
        valueType: {}
    };

    protected getMetadata() {
        return ValueInterceptorAfterHandler.metadata;
    }
}