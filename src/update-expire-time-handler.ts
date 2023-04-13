import { ExpireTimeHandlerBase } from './expire-time-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { Time } from './value-type-data';

export class UpdateExpireTimeValueHandler extends ExpireTimeHandlerBase {
    protected async handling(option: ValueHandlerOption, time: Time) {
        if (!time.expiredOn)
            return;

        const now = await this.getNowFunc();
        const ownValue = await option.valueService.ownValue;
        if (now > (ownValue[time.expiredOnValueType] || 0))
            ownValue[option.value.valueType] = 0;

        ownValue[time.expiredOnValueType] = time.expiredOn;
    }
}