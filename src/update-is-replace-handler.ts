import { EnumFactoryBase } from 'lite-ts-enum';

import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerContext } from './value-handler-context';
import { ValueTypeData } from './value-type-data';

export class UpdateIsReplaceValueHandler extends ValueHandlerBase {
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
            const ownValue = await ctx.valueService.ownValue;
            ownValue[ctx.value.valueType] = 0;
        }

        await this.next?.handle?.(ctx);
    }
}