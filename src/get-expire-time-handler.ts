import { ExpireTimeHandlerBase } from './expire-time-handler-base';
import { Value } from './value';

export class GetExpirationValueHandler extends ExpireTimeHandlerBase {
    protected async handleDiff(value: Value) {
        value.count = 0;
    }
}