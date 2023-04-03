import { ExpirationHandlerBase } from './expiration-handler-base';
import { Value } from './value';
import { ValueService } from './value-service';

export class UpdateExpirationValueHandler extends ExpirationHandlerBase {
    protected async handleDiff(value: Value, valueService: ValueService) {
        const ownValue = await valueService.ownValue;
        ownValue[value.valueType] = 0;
    }
}