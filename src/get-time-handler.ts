import { TimeValueHandlerBase } from './time-handler-base';
import { Value } from './value';

export class GetTimeValueHandler extends TimeValueHandlerBase {
    protected async handleDiff(_: number, value: Value) {
        value.count = 0;
    }
}