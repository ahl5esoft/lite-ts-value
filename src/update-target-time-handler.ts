import { ExpireTimeHandlerBase, Time } from './expire-time-handler-base';
import { Value } from './value';
import { ValueService } from './value-service';

export class UpdateTargetTimeValueHandler extends ExpireTimeHandlerBase {
    protected async handleDiff(value: Value, valueService: ValueService, time: Time, areaNo: number) {
        if (!time.targetType)
            return;

        const ownValue = await valueService.ownValue;
        const res = await this.rpc.callWithoutThrow<number>({
            route: `/${time.targetType.app}/get-expire-time`,
            body: {
                areaNo: areaNo ?? 0,
                userID: this.userID,
                ext: time.targetType.ext
            }
        });
        ownValue[time.expiredOnValueType] = res.data;
        ownValue[value.valueType] = 0;
    }
}