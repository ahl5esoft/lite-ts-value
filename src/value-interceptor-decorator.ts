import { IValueInterceptor, valueInterceptorMetadata } from './value-interceptor-metadata';
import { ValueTypeData } from './value-type-data';

/**
 * 数值拦截器
 * 
 * @param valueType 数值类型
 */
export function ValueIntercept(valueType: number, operation: 'after' | 'before'): (ctor: new () => IValueInterceptor) => void;

/**
 * 数值拦截器
 * 
 * @param predicate 断言
 */
export function ValueIntercept(predicate: (valueType: ValueTypeData) => boolean, operation: 'after' | 'before'): (ctor: new () => IValueInterceptor) => void;

/**
 * 数值拦截装饰器
 * 
 * @param any 数值类型或断言
 */
export function ValueIntercept(any: number | ((valueType: ValueTypeData) => boolean), operation: 'after' | 'before') {
    return (ctor: new () => IValueInterceptor) => {
        if (typeof any == 'number') {
            valueInterceptorMetadata.valueType[any] ??= {};
            valueInterceptorMetadata.valueType[any][operation] = ctor;
        } else {
            valueInterceptorMetadata.predicates.push({
                ctor,
                operation,
                predicate: any,
            });
        }
    };
}
