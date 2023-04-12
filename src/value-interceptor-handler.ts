import { opentracing } from 'jaeger-client';
import { EnumFactoryBase } from 'lite-ts-enum';
import { TracerStrategy } from 'lite-ts-jaeger-client';
import Container from 'typedi';

import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { valueInterceptorMetadata } from './value-interceptor-metadata';
import { ValueTypeData } from './value-type-data';

export class ValueInterceptorHandler extends ValueHandlerBase {

    public constructor(
        private m_EnumFactory: EnumFactoryBase,
        private m_Operation: 'after' | 'before',
        private m_ParentSpan?: opentracing.Span
    ) {
        super();
    };

    public async handle(option: ValueHandlerOption) {
        if (!valueInterceptorMetadata.valueType[option.value.valueType]?.[this.m_Operation]) {
            const allValueTypeItem = await this.m_EnumFactory.build(ValueTypeData).allItem;
            if (allValueTypeItem[option.value.valueType]) {
                for (const r of valueInterceptorMetadata.predicates) {
                    if (this.m_Operation != r.operation)
                        continue;

                    const ok = r.predicate(allValueTypeItem[option.value.valueType]);
                    if (ok) {
                        valueInterceptorMetadata.valueType[option.value.valueType] ??= {};
                        valueInterceptorMetadata.valueType[option.value.valueType][this.m_Operation] = r.ctor;
                    }
                }
            }
        }

        if (valueInterceptorMetadata.valueType[option.value.valueType]?.[this.m_Operation]) {
            const interceptor = Container.get(valueInterceptorMetadata.valueType[option.value.valueType][this.m_Operation]);
            Container.remove(valueInterceptorMetadata.valueType[option.value.valueType][this.m_Operation]);
            const traceInterceptor = new TracerStrategy(interceptor).withTrace(this.m_ParentSpan);
            const ok = await traceInterceptor.notify(option);
            if (ok)
                return;
        }

        await this.next?.handle?.(option);
    }
}