import { ExpireTimeHandlerBase } from './expire-time-handler-base';
import { ValueHandlerContext } from './value-handler-context';
import { Time } from './value-type-data';

export class UpdateDurationTimeValueHandler extends ExpireTimeHandlerBase {
    protected async onHandle(ctx: ValueHandlerContext, time: Time) {
        if (!time.duration)
            return;

        const now = await this.getNowFunc();
        const ownValue = await ctx.valueService.ownValue;
        if (ownValue[time.expireOnValueType] > now) {
            ownValue[time.expireOnValueType] += time.duration;
        } else {
            ownValue[time.expireOnValueType] = now + time.duration;
            ownValue[ctx.value.valueType] = 0;
        }
    }
}