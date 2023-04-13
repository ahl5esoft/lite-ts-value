import { ExpireTimeHandlerBase } from './expire-time-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { Time } from './value-type-data';

export class GetExpireTimeValueHandler extends ExpireTimeHandlerBase {
    protected async handling(option: ValueHandlerOption, time: Time) {
        const now = await this.getNowFunc();
        const oldNow = await option.valueService.getCount(option.uow, time.expireOnValueType);
        if (now > oldNow)
            option.value.count = 0;
    }
}