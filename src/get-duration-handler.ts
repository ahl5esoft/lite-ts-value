import { DurationHandlerBase } from './duration-handler-base';
import { Value } from './value';

export class GetDurationValueHandler extends DurationHandlerBase {
    protected async handleDiff(value: Value) {
        value.count = 0;
    };
}