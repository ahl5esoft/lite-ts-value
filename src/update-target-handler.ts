import { TargetHandlerBase, TargetType } from './target-handler-base';
import { Value } from './value';
import { ValueService } from './value-service';

export class UpdateTargetValueHandler extends TargetHandlerBase {
    protected async handleDiff(value: Value, valueService: ValueService, areaNo: number, targetType: TargetType) {
        const ownValue = await valueService.ownValue;
        const res = await this.rpc.callWithoutThrow<number>({
            route: `/${targetType.app}/get-expire-time`,
            body: {
                areaNo: areaNo ?? 0,
                userID: this.userID,
                ext: targetType.ext
            }
        });
        ownValue[targetType.valueType] = res.data;
        ownValue[value.valueType] = 0;
    }
}