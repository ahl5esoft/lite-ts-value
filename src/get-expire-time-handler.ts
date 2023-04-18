import { ExpireTimeHandlerBase } from './expire-time-handler-base';
import { ValueHandlerContext } from './value-handler-context';
import { Time } from './value-type-data';

export class GetExpireTimeValueHandler extends ExpireTimeHandlerBase {
    protected async onHandle(option: ValueHandlerContext, time: Time) {
        const now = await this.getNowFunc();
        const oldNow = await option.valueService.getCount(option.uow, time.expireOnValueType);
        if (now > oldNow)
            option.value.count = 0;
    }
}