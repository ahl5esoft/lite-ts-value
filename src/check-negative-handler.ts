import { EnumFactoryBase } from 'lite-ts-enum';

import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerContext } from './value-handler-context';
import { ValueTypeData } from './value-type-data';

export class CustomError extends Error {
    public constructor(public code: number, public data?: any) {
        super('');
    }
}

export class CheckNegativeValueHandler extends ValueHandlerBase {
    public static notEnoughErrorCode = 505;

    public constructor(
        private m_EnumFactory: EnumFactoryBase,
    ) {
        super();
    }

    public async handle(ctx: ValueHandlerContext) {
        const count = await ctx.valueService.getCount(ctx.uow, ctx.value.valueType);
        const allItem = await this.m_EnumFactory.build<ValueTypeData>(ValueTypeData.ctor, ctx.areaNo).allItem;
        if (count < 0 && !allItem[ctx.value.valueType]?.isNegative) {
            throw new CustomError(CheckNegativeValueHandler.notEnoughErrorCode, {
                consume: Math.abs(ctx.value.count),
                count: count - ctx.value.count,
                valueType: ctx.value.valueType,
            });
        }

        await this.next?.handle?.(ctx);
    }
}