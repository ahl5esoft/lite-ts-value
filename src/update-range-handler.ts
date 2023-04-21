import { EnumFactoryBase } from 'lite-ts-enum';

import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerContext } from './value-handler-context';
import { ValueTypeData } from './value-type-data';

export class UpdateRangeValueHandler extends ValueHandlerBase {
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
        const range = allItem[ctx.value.valueType]?.range;
        if (range) {
            const count = await ctx.valueService.getCount(ctx.uow, ctx.value.valueType);
            const ownValue = await ctx.valueService.ownValue;
            if (count > range.max)
                ownValue[ctx.value.valueType] = range.max;

            if (count < range.min)
                ownValue[ctx.value.valueType] = range.min;
        }

        await this.next?.handle?.(ctx);
    }
}