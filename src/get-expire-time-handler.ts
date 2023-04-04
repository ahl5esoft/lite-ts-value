import { ExpireTimeHanglerBase } from './expire-time-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { Time } from './value-type-data';

export class GetExpireTimeValueHandler extends ExpireTimeHanglerBase {
    protected async handleDiff(option: ValueHandlerOption, time: Time) {
        const now = await this.getNowFunc();
        const oldNow = await option.valueService.getCount(option.uow, time.expiredOnValueType);
        if (now > oldNow)
            option.value.count = 0;
    }
}