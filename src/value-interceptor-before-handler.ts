import { TracerStrategy } from 'lite-ts-jaeger-client';
import Container from 'typedi';

import { ValueHandlerOption } from './value-handler-option';
import { IValueInterceptor } from './value-interceptor-decorator';
import { ValueInterceptorHandlerBase } from './value-interceptor-handler-base';
import { ValueTypeData } from './value-type-data';

/**
 * 更新前数值拦截元数据
 */
export const valueInterceptorBeforeMetadata = {
    /**
     * 断言
     */
    predicates: [] as {
        /**
         * 构造函数
         */
        ctor: new () => IValueInterceptor<any>;
        /**
         * 断言
         */
        predicate: (valueType: ValueTypeData) => boolean;
    }[],
    /**
     * 数值类型
     */
    beforeValueType: {} as { [valueType: number]: new () => IValueInterceptor<any>; }
};

export class ValueInterceptorBeforeHandler extends ValueInterceptorHandlerBase {
    protected async intercept(option: ValueHandlerOption) {
        if (!valueInterceptorBeforeMetadata.beforeValueType[option.value.valueType]) {
            const allValueTypeItem = await this.enumFactory.build(ValueTypeData).allItem;
            if (allValueTypeItem[option.value.valueType]) {
                for (const r of valueInterceptorBeforeMetadata.predicates) {
                    const ok = r.predicate(allValueTypeItem[option.value.valueType]);
                    if (ok)
                        valueInterceptorBeforeMetadata.beforeValueType[option.value.valueType] = r.ctor;
                }
            }
        }

        if (valueInterceptorBeforeMetadata.beforeValueType[option.value.valueType]) {
            const interceptor = Container.get(valueInterceptorBeforeMetadata.beforeValueType[option.value.valueType]);
            Container.remove(valueInterceptorBeforeMetadata.beforeValueType[option.value.valueType]);
            const traceInterceptor = new TracerStrategy(interceptor).withTrace(this.parentSpan);
            const ok = await traceInterceptor.intercept(option);
            return ok;
        }

        return false;
    }
}