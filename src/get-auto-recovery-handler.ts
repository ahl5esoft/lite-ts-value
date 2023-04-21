import { EnumFactoryBase } from 'lite-ts-enum';

import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerContext } from './value-handler-context';
import { ValueTypeData } from './value-type-data';

export class GetAutoRecoveryValueHandler extends ValueHandlerBase {
    public constructor(
        private enumFactory: EnumFactoryBase,
        private getNowFunc: () => Promise<number>,
    ) {
        super();
    }

    public async handle(ctx: ValueHandlerContext) {
        const allItem = await this.enumFactory.build({
            app: 'config',
            areaNo: ctx.areaNo,
            ctor: ValueTypeData,
        }).allItem;
        const autoRecovery = allItem[ctx.value.valueType]?.autoRecovery;
        if (autoRecovery) {
            const countdownOn = await ctx.valueService.getCount(ctx.uow, autoRecovery.countdownOnValueType);
            if (countdownOn) {
                const now = await this.getNowFunc();
                const diff = Math.floor((now - countdownOn) / autoRecovery.interval);
                if (diff) {
                    ctx.value.count += diff;
                    const max = await ctx.valueService.getCount(ctx.uow, autoRecovery.limitValueType);
                    if (ctx.value.count > max)
                        ctx.value.count = max;
                }
            }
        }

        await this.next?.handle?.(ctx);
    }
}