import { EnumFactoryBase } from 'lite-ts-enum';
import { TimeBase } from 'lite-ts-time';

import { Value } from './value';
import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerContext } from './value-handler-context';
import { ValueService } from './value-service';
import { ValueTypeData } from './value-type-data';

export abstract class TimeValueHandlerBase extends ValueHandlerBase {
    public constructor(
        protected enumFactory: EnumFactoryBase,
        protected time: TimeBase,
        protected getNowFunc: () => Promise<number>,
    ) {
        super();
    }

    public async handle(ctx: ValueHandlerContext) {
        const allItem = await this.enumFactory.build({
            app: 'config',
            areaNo: ctx.areaNo,
            ctor: ValueTypeData,
        }).allItem;
        const time = allItem[ctx.value.valueType]?.time;
        if (time?.valueType) {
            const now = await this.getNowFunc();
            const oldNow = await ctx.valueService.getCount(ctx.uow, time.valueType);
            const ok = this.time.isSameUnix(now, oldNow, allItem[time.valueType]?.time?.momentType);
            if (!ok)
                await this.handleDiff(time.valueType, ctx.value, ctx.valueService);
        }

        await this.next?.handle?.(ctx);
    }

    protected abstract handleDiff(timeValueType: number, value: Value, valueService: ValueService): Promise<void>;
}