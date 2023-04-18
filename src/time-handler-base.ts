import { EnumFactoryBase } from 'lite-ts-enum';
import moment from 'moment';

import { Value } from './value';
import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerContext } from './value-handler-context';
import { ValueService } from './value-service';
import { ValueTypeData } from './value-type-data';

export abstract class TimeValueHandlerBase extends ValueHandlerBase {
    public constructor(
        protected enumFactory: EnumFactoryBase,
        protected getNowFunc: () => Promise<number>,
    ) {
        super();
    }

    public async handle(ctx: ValueHandlerContext) {
        const allItem = await this.enumFactory.build<ValueTypeData>(ValueTypeData.ctor, ctx.areaNo).allItem;
        const time = allItem[ctx.value.valueType]?.time;
        if (time?.valueType) {
            const now = await this.getNowFunc();
            const oldNow = await ctx.valueService.getCount(ctx.uow, time.valueType);
            const ok = moment.unix(now).isSame(
                moment.unix(oldNow),
                allItem[time.valueType]?.time?.momentType ?? 'day'
            );
            if (!ok)
                await this.handleDiff(time.valueType, ctx.value, ctx.valueService);
        }

        await this.next?.handle?.(ctx);
    }

    protected abstract handleDiff(timeValueType: number, value: Value, valueService: ValueService): Promise<void>;
}