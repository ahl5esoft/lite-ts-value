import { ExpireTimeHanglerBase } from './expire-time-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { Time } from './value-type-data';

export class UpdateExpireTimeValueHandler extends ExpireTimeHanglerBase {
    protected async handleDiff(option: ValueHandlerOption, time: Time) {
        if (!time.expireOn)
            return;

        const now = await this.getNowFunc();
        const ownValue = await option.valueService.ownValue;
        ownValue[time.expiredOnValueType] = time.expireOn;
        if (now > ownValue[time.expiredOnValueType])
            ownValue[option.value.valueType] = 0;
    }
}