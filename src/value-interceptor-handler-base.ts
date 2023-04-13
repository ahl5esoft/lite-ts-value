import { opentracing } from 'jaeger-client';
import { TracerStrategy } from 'lite-ts-jaeger-client';
import { EnumFactoryBase } from 'lite-ts-enum';
import Container from 'typedi';

import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { ValueTypeData } from './value-type-data';

type Metadata = {
    predicates: {
        ctor: new () => IValueInterceptor<any>;
        predicate: (valueType: ValueTypeData) => boolean;
    }[];
    valueType: {
        [valueType: number]: new () => IValueInterceptor<any>;
    };
};

export interface IValueInterceptor<T> {
    intercept(option: ValueHandlerOption): Promise<T>;
}

export abstract class ValueInterceptorHandlerBase extends ValueHandlerBase {

    /**
     * 更新数值拦截元数据
     */
    public static metadata = {
        /**
         * 断言
         */
        predicates: [],
        /**
         * 数值类型
         */
        valueType: {}
    } as Metadata;

    public constructor(
        protected enumFactory: EnumFactoryBase,
        protected parentSpan?: opentracing.Span
    ) {
        super();
    };

    public async handle(option: ValueHandlerOption) {
        const metadata = this.getMetadata();
        if (!metadata.valueType[option.value.valueType]) {
            const allValueTypeItem = await this.enumFactory.build<ValueTypeData>(ValueTypeData.ctor, option.areaNo).allItem;
            if (allValueTypeItem[option.value.valueType]) {
                for (const r of metadata.predicates) {
                    const ok = r.predicate(allValueTypeItem[option.value.valueType]);
                    if (ok)
                        metadata.valueType[option.value.valueType] = r.ctor;
                }
            }
        }

        if (metadata.valueType[option.value.valueType]) {
            const interceptor = Container.get(metadata.valueType[option.value.valueType]);
            Container.remove(metadata.valueType[option.value.valueType]);
            const traceInterceptor = new TracerStrategy(interceptor).withTrace(this.parentSpan);
            const ok = await traceInterceptor.intercept(option);
            if (ok)
                return;
        }

        await this.next?.handle?.(option);
    }

    protected abstract getMetadata(): Metadata;
}