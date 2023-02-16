import { Value } from './value';
import { ValueHandlerBase } from './value-handler-base';
import { ValueService } from './value-service';

export class UpdateCountHandler extends ValueHandlerBase {
    public async handle(value: Value, valueService: ValueService) {
        const ownValue = await valueService.ownValue;
        ownValue[value.valueType] ??= 0;
        ownValue[value.valueType] += value.count;

        this.next?.handle?.(value, valueService);
    }
}