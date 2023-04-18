import { EnumFactoryBase } from 'lite-ts-enum';

import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerContext } from './value-handler-context';
import { Time, ValueTypeData } from './value-type-data';

export abstract class ExpireTimeHandlerBase extends ValueHandlerBase {

    public constructor(
        protected getNowFunc: () => Promise<number>,
        private m_EnumFactory: EnumFactoryBase
    ) {
        super();
    }

    public async handle(ctx: ValueHandlerContext) {
        const allItem = await this.m_EnumFactory.build<ValueTypeData>(ValueTypeData.ctor, ctx.areaNo).allItem;
        const time = allItem[ctx.value.valueType]?.time;
        if (time?.expireOnValueType)
            await this.onHandle(ctx, time);

        await this.next?.handle?.(ctx);
    }

    protected abstract onHandle(ctx: ValueHandlerContext, time: Time): Promise<void>;
}