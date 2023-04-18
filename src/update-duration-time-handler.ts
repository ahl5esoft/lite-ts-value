import { ExpireTimeHandlerBase } from './expire-time-handler-base';
import { ValueHandlerContext } from './value-handler-context';
import { Time } from './value-type-data';

export class UpdateDurationTimeValueHandler extends ExpireTimeHandlerBase {
    protected async handling(option: ValueHandlerContext, time: Time) {
        if (!time.duration)
            return;

        const now = await this.getNowFunc();
        const ownValue = await option.valueService.ownValue;
        if (ownValue[time.expireOnValueType] > now) {
            ownValue[time.expireOnValueType] += time.duration;
        } else {
            ownValue[time.expireOnValueType] = now + time.duration;
            ownValue[option.value.valueType] = 0;
        }
    }
}