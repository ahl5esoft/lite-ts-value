import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerOption } from './value-handler-option';

export class UpdateCountHandler extends ValueHandlerBase {
    public async handle(options: ValueHandlerOption) {
        const ownValue = await options.valueService.ownValue;
        ownValue[options.value.valueType] ??= 0;
        ownValue[options.value.valueType] += options.value.count;

        this.next?.handle?.(options);
    }
}