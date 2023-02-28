import { IEnumFactory } from './i-enum-factory';
import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { ValueTypeData } from './value-type-data';

export class UpdateRangeHandler extends ValueHandlerBase {
    public constructor(
        private m_EnumFactory: IEnumFactory,
    ) {
        super();
    }

    public async handle(option: ValueHandlerOption) {
        const allItem = await this.m_EnumFactory.build<ValueTypeData>('ValueTypeData').allItem;
        const range = allItem[option.value.valueType]?.range;
        if (range) {
            const count = await option.valueService.getCount(option.uow, option.value.valueType);
            const ownValue = await option.valueService.ownValue;
            if (count > range.max)
                ownValue[option.value.valueType] = range.max;

            if (count < range.min)
                ownValue[option.value.valueType] = range.min;
        }

        this.next?.handle?.(option);
    }
}