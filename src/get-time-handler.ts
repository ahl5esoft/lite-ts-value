import { IValue } from './i-value';
import { TimeHandlerBase } from './time-handler-base';

export class GetTimeHandler extends TimeHandlerBase {
    protected async handleDiff(value: IValue) {
        value.count = 0;
    }
}