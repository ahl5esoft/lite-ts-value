import { EnumFactoryBase } from 'lite-ts-enum';

import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerContext } from './value-handler-context';
import { ValueTypeData } from './value-type-data';

export class FilterIsReplaceValueHandler extends ValueHandlerBase {
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
        if (allItem[ctx.value.valueType]?.isReplace) {
            const count = await ctx.valueService.getCount(ctx.uow, ctx.value.valueType);
            if (count == ctx.value.count)
                return;
        } else if (ctx.value.count == 0) {
            return;
        }

        await this.next.handle(ctx);
    }
}