import { DurationHandlerBase } from './duration-handler-base';
import { Value } from './value';
import { ValueService } from './value-service';

export class UpdateDurationValueHandler extends DurationHandlerBase {
    protected async handleDiff(value: Value, valueService: ValueService, durationValueType: number, time: number) {
        const now = await this.getNowFunc();
        const ownValue = await valueService.ownValue;
        ownValue[durationValueType] = now + time;
        ownValue[value.valueType] = 0;
    };
}