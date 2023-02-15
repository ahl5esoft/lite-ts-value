import { IValue } from './i-value';
import { TimeValueHandlerBase } from './time-handler-base';

export class GetTimeValueHandler extends TimeValueHandlerBase {
    protected async handleDiff(value: IValue) {
        value.count = 0;
    }
}