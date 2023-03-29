import { ExpirationHandlerBase } from './expiration-handler-base';
import { Value } from './value';

export class GetExpirationValueHandler extends ExpirationHandlerBase {
    protected async handleDiff(_: number, value: Value) {
        value.count = 0;
    }
}