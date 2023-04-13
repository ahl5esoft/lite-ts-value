import { opentracing } from 'jaeger-client';
import { EnumFactoryBase } from 'lite-ts-enum';

import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerOption } from './value-handler-option';

export abstract class ValueInterceptorHandlerBase extends ValueHandlerBase {

    public constructor(
        protected enumFactory: EnumFactoryBase,
        protected parentSpan?: opentracing.Span
    ) {
        super();
    };

    public async handle(option: ValueHandlerOption) {
        const ok = await this.intercept(option);
        if (ok)
            return;

        await this.next?.handle?.(option);
    }

    protected abstract intercept(option: ValueHandlerOption): Promise<void | boolean>;
}