import { ExpireTimeHandlerBase } from './expire-time-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { Time } from './value-type-data';

export class UpdateExpireTimeValueHandler extends ExpireTimeHandlerBase {
    protected async handling(option: ValueHandlerOption, time: Time) {
        if (!time.expireOn)
            return;

        const ownValue = await option.valueService.ownValue;
        ownValue[time.expiredOnValueType] = time.expireOn;
    }
}