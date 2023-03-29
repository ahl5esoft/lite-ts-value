import { ExpirationHandlerBase } from './expiration-handler-base';
import { Value } from './value';
import { ValueService } from './value-service';
import { ValueTypeData } from './value-type-data';

export class UpdateExpirationValueHandler extends ExpirationHandlerBase {
    protected async handleDiff(expirationValueType: number, value: Value, valueService: ValueService, allItem: { [no: number]: ValueTypeData; }) {
        const ownValue = await valueService.ownValue;
        const now = await this.getNowFunc();
        ownValue[value.valueType] = 0;
        ownValue[expirationValueType] = now + allItem[expirationValueType].expiration.expirationOn;
    }
}