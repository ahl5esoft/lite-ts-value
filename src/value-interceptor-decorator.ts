import { ValueHandlerOption } from './value-handler-option';
import { valueInterceptorAfterMetadata } from './value-interceptor-after-handler';
import { valueInterceptorBeforeMetadata } from './value-interceptor-before-handler';
import { ValueTypeData } from './value-type-data';

export interface IValueInterceptor<T> {
    intercept(option: ValueHandlerOption): Promise<T>;
}

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
            valueInterceptorAfterMetadata.afterValueType[any] = ctor;
        } else {
            valueInterceptorAfterMetadata.predicates.push({
                ctor,
                predicate: any,
            });
        }
    };
}

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
            valueInterceptorBeforeMetadata.beforeValueType[any] = ctor;
        } else {
            valueInterceptorBeforeMetadata.predicates.push({
                ctor,
                predicate: any,
            });
        }
    };
}