import { ExpireTimeHandlerBase } from './expire-time-handler-base';
import { ValueHandlerContext } from './value-handler-context';
import { Time } from './value-type-data';

export class UpdateExpireTimeValueHandler extends ExpireTimeHandlerBase {
    protected async onHandle(ctx: ValueHandlerContext, time: Time) {
        if (!time.expireOn)
            return;

        const now = await this.getNowFunc();
        const ownValue = await ctx.valueService.ownValue;
        if (now > (ownValue[time.expireOnValueType] || 0))
            ownValue[ctx.value.valueType] = 0;

        ownValue[time.expireOnValueType] = time.expireOn;
    }
}