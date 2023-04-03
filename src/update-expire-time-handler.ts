import { ExpireTimeHandlerBase, Time } from './expire-time-handler-base';
import { Value } from './value';
import { ValueService } from './value-service';

export class UpdateExpireTimeValueHandler extends ExpireTimeHandlerBase {
    protected async handleDiff(value: Value, valueService: ValueService, time: Time) {
        if (!time.expireOn)
            return;

        const ownValue = await valueService.ownValue;
        ownValue[value.valueType] = 0;
        ownValue[time.expiredOnValueType] = time.expireOn;
    }
}