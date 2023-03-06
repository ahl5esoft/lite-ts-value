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
        if (autoRecovery) {
            const ownValue = option.valueService.ownValue;
            const count = ownValue[option.value.valueType];
            const max = ownValue[autoRecovery.limitValueType];
            if (option.value.count > 0) {
                ownValue[option.value.valueType] = count + option.value.count > max ? max : count + option.value.count;
                ownValue[autoRecovery.countdownOnValueType] = 0;
            }
        }

        this.next?.handle?.(option);
    }
}