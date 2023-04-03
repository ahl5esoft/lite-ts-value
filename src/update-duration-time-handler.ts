import { ExpireTimeHandlerBase, Time } from './expire-time-handler-base';
import { Value } from './value';
import { ValueService } from './value-service';

export class UpdateDurationTimeValueHandler extends ExpireTimeHandlerBase {
    protected async handleDiff(value: Value, valueService: ValueService, time: Time) {
        if (!time.duration)
            return;

        const now = await this.getNowFunc();
        const ownValue = await valueService.ownValue;
        ownValue[time.expiredOnValueType] = now + time.duration;
        ownValue[value.valueType] = 0;
    };
}