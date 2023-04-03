import { ExpirationHandlerBase } from './expiration-handler-base';
import { Value } from './value';

export class GetExpirationValueHandler extends ExpirationHandlerBase {
    protected async handleDiff(value: Value) {
        value.count = 0;
    }
}