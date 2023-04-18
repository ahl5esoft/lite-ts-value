import { ExpireTimeHandlerBase } from './expire-time-handler-base';
import { ValueHandlerContext } from './value-handler-context';
import { Time } from './value-type-data';

export class GetExpireTimeValueHandler extends ExpireTimeHandlerBase {
    protected async onHandle(ctx: ValueHandlerContext, time: Time) {
        const now = await this.getNowFunc();
        const oldNow = await ctx.valueService.getCount(ctx.uow, time.expireOnValueType);
        if (now > oldNow)
            ctx.value.count = 0;
    }
}