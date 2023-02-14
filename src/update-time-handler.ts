import { IValue } from './i-value';
import { TimeHandlerBase } from './time-handler-base';

export class UpdateTimeHandler extends TimeHandlerBase {
    protected async handleDiff(value: IValue, timeValueType: number) {
        const ownValue = await this.ownValue;
        ownValue[value.valueType] = 0;
        ownValue[timeValueType] = await this.now;
    }
}