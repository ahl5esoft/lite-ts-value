import { IValue } from './i-value';
import { TimeValueHandlerBase } from './time-handler-base';

export class UpdateTimeHandler extends TimeValueHandlerBase {
    protected async handleDiff(value: IValue, timeValueType: number) {
        const ownValue = await this.ownValue;
        ownValue[value.valueType] = 0;
        ownValue[timeValueType] = await this.now;
    }
}