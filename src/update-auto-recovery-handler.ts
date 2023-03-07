import { IEnumFactory } from './i-enum-factory';
import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { ValueTypeData } from './value-type-data';

export class UpdateAutoRecoveryHandler extends ValueHandlerBase {
    public constructor(
        protected enumFactory: IEnumFactory,
    ) {
        super();
    }

    public async handle(option: ValueHandlerOption) {
        const allItem = await this.enumFactory.build<ValueTypeData>('ValueTypeData').allItem;
        const autoRecovery = allItem[option.value.valueType]?.autoRecovery;
        if (autoRecovery && option.value.count > 0) {
            const ownValue = await option.valueService.ownValue;
            const max = ownValue[autoRecovery.limitValueType];
            if (ownValue[option.value.valueType] + option.value.count > max)
                option.value.count = max - ownValue[option.value.valueType];
        }

        await this.next?.handle?.(option);
    }
}