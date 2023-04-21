import { EnumFactoryBase } from 'lite-ts-enum';

import { ValueHandlerContext } from './value-handler-context';
import { ValueHandlerBase } from './value-handler-base';
import { ValueTypeData } from './value-type-data';

export class UpdateSyncValueHandler extends ValueHandlerBase {
    public constructor(
        private m_EnumFactory: EnumFactoryBase,
    ) {
        super();
    }

    public async handle(ctx: ValueHandlerContext) {
        const allItem = await this.m_EnumFactory.build({
            app: 'config',
            areaNo: ctx.areaNo,
            ctor: ValueTypeData,
        }).allItem;
        const sync = allItem[ctx.value.valueType]?.sync;
        if (sync?.valueTypes?.length) {
            await ctx.valueService.update(
                ctx.uow,
                sync.valueTypes.filter(r => r != ctx.value.valueType).map(r => {
                    return {
                        ...ctx.value,
                        valueType: r
                    };
                })
            );
        }

        if (ctx.value.count < 0 && sync?.absValeuTypes?.length) {
            const count = Math.abs(ctx.value.count);
            await ctx.valueService.update(
                ctx.uow,
                sync.absValeuTypes.filter(r => r != ctx.value.valueType).map(r => {
                    return {
                        ...ctx.value,
                        valueType: r,
                        count
                    };
                })
            );
        }

        await this.next?.handle?.(ctx);
    }
}