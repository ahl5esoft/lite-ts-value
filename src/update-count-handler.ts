import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerContext } from './value-handler-context';

export class UpdateCountValueHandler extends ValueHandlerBase {
    public async handle(option: ValueHandlerContext) {
        const ownValue = await option.valueService.ownValue;
        ownValue[option.value.valueType] ??= 0;
        ownValue[option.value.valueType] += option.value.count;

        await this.next?.handle?.(option);
    }
}