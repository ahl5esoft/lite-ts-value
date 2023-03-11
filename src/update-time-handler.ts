import { TimeValueHandlerBase } from './time-handler-base';
import { Value } from './value';
import { ValueService } from './value-service';

export class UpdateTimeValueHandler extends TimeValueHandlerBase {
    protected async handleDiff(timeValueType: number, value: Value, valueService: ValueService) {
        const ownValue = await valueService.ownValue;
        ownValue[value.valueType] = 0;
        ownValue[timeValueType] = await this.getNowFunc();
    }
}