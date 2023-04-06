import { ExpireTimeHandlerBase } from './expire-time-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { Time } from './value-type-data';

export class UpdateDurationTimeValueHandler extends ExpireTimeHandlerBase {
    protected async handling(option: ValueHandlerOption, time: Time) {
        if (!time.duration)
            return;

        const now = await this.getNowFunc();
        const ownValue = await option.valueService.ownValue;
        if (ownValue[time.expiredOnValueType] > now) {
            ownValue[time.expiredOnValueType] += time.duration;
        } else {
            ownValue[time.expiredOnValueType] = now + time.duration;
            ownValue[option.value.valueType] = 0;
        }
    }
}