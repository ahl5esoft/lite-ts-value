import { IValueInterceptor, ValueInterceptorHandlerBase } from './value-interceptor-handler-base';
import { ValueTypeData } from './value-type-data';


/**
 * 数值拦截器
 * 
 * @param valueType 数值类型
 */
export function ValueBeforeIntercept(valueType: number): (ctor: new () => IValueInterceptor<boolean>) => void;

/**
 * 数值拦截器
 * 
 * @param predicate 断言
 */
export function ValueBeforeIntercept(predicate: (valueType: ValueTypeData) => boolean): (ctor: new () => IValueInterceptor<boolean>) => void;

/**
 * 数值拦截装饰器
 * 
 * @param any 数值类型或断言
 */
export function ValueBeforeIntercept(any: number | ((valueType: ValueTypeData) => boolean)) {
    return (ctor: new () => IValueInterceptor<boolean>) => {
        if (typeof any == 'number') {
            ValueInterceptorBeforeHandler.metadata.valueType[any] = ctor;
        } else {
            ValueInterceptorBeforeHandler.metadata.predicates.push({
                ctor,
                predicate: any,
            });
        }
    };
}

export class ValueInterceptorBeforeHandler extends ValueInterceptorHandlerBase {

    /**
     * 更新数值拦截元数据
     */
    public static metadata = {
        predicates: [],
        valueType: {}
    };

    protected getMetadata() {
        return ValueInterceptorBeforeHandler.metadata;
    }
}