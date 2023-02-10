import { IValue } from './i-value';
import { TimeHandlerBase } from './time-handler-base';

export class UpdateTimeHandler extends TimeHandlerBase {
    protected async handleDiff(value: IValue) {
        const ownValue = await this.ownValue;
        ownValue[value.valueType] = 0;
        const time = await this.time;
        ownValue[time.valueType] = await this.now;
    }
}