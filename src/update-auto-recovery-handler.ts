import { EnumFactoryBase } from 'lite-ts-enum';

import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerContext } from './value-handler-context';
import { ValueTypeData } from './value-type-data';

export class UpdateAutoRecoveryValueHandler extends ValueHandlerBase {
    public constructor(
        private m_EnumFactory: EnumFactoryBase,
        private m_GetNowFunc: () => Promise<number>
    ) {
        super();
    }

    public async handle(ctx: ValueHandlerContext) {
        const allItem = await this.m_EnumFactory.build<ValueTypeData>(ValueTypeData.ctor, ctx.areaNo).allItem;
        const autoRecovery = allItem[ctx.value.valueType]?.autoRecovery;
        if (autoRecovery) {
            const countdownOn = await ctx.valueService.getCount(ctx.uow, autoRecovery.countdownOnValueType);
            const now = await this.m_GetNowFunc();
            const diff = Math.floor((now - countdownOn) / autoRecovery.interval);
            const max = await ctx.valueService.getCount(ctx.uow, autoRecovery.limitValueType);
            const ownValue = await ctx.valueService.ownValue;
            if (diff) {
                ownValue[autoRecovery.countdownOnValueType] = now;
                await ctx.valueService.update(ctx.uow, [
                    {
                        count: diff,
                        valueType: ctx.value.valueType,
                        source: `${ctx.value.source}[定时恢复]`
                    }
                ]);
            }

            if (ownValue[ctx.value.valueType] + ctx.value.count > max)
                ctx.value.count = max - ownValue[ctx.value.valueType];
        }

        await this.next?.handle?.(ctx);
    }
}