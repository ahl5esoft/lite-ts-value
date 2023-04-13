import { TracerStrategy } from 'lite-ts-jaeger-client';
import Container from 'typedi';

import { ValueHandlerOption } from './value-handler-option';
import { IValueInterceptor } from './value-interceptor-decorator';
import { ValueInterceptorHandlerBase } from './value-interceptor-handler-base';
import { ValueTypeData } from './value-type-data';

/**
 * 更新前数值拦截元数据
 */
export const valueInterceptorAfterMetadata = {
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
    afterValueType: {} as { [valueType: number]: new () => IValueInterceptor<any>; }
};

export class ValueInterceptorAfterHandler extends ValueInterceptorHandlerBase {
    protected async intercept(option: ValueHandlerOption) {
        if (!valueInterceptorAfterMetadata.afterValueType[option.value.valueType]) {
            const allValueTypeItem = await this.enumFactory.build<ValueTypeData>(ValueTypeData.ctor, option.areaNo).allItem;
            if (allValueTypeItem[option.value.valueType]) {
                for (const r of valueInterceptorAfterMetadata.predicates) {
                    const ok = r.predicate(allValueTypeItem[option.value.valueType]);
                    if (ok)
                        valueInterceptorAfterMetadata.afterValueType[option.value.valueType] = r.ctor;
                }
            }
        }

        if (valueInterceptorAfterMetadata.afterValueType[option.value.valueType]) {
            const interceptor = Container.get(valueInterceptorAfterMetadata.afterValueType[option.value.valueType]);
            Container.remove(valueInterceptorAfterMetadata.afterValueType[option.value.valueType]);
            const traceInterceptor = new TracerStrategy(interceptor).withTrace(this.parentSpan);
            await traceInterceptor.intercept(option);
        }
    }
}