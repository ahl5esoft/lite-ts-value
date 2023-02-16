import { IEnumFactory } from './i-enum-factory';
import { Value } from './value';
import { ValueHandlerBase } from './value-handler-base';
import { ValueService } from './value-service';
import { ValueTypeData } from './value-type-data';

export class UpdateRangeHandler extends ValueHandlerBase {
    public constructor(
        private m_EnumFactory: IEnumFactory,
    ) {
        super();
    }

    public async handle(value: Value, valueService: ValueService) {
        const allItem = await this.m_EnumFactory.build<ValueTypeData>('ValueTypeData').allItem;
        const range = allItem[value.valueType]?.range;
        if (range) {
            const count = await valueService.getCount(value.valueType);
            const ownValue = await valueService.ownValue;
            if (count > range.max)
                ownValue[value.valueType] = range.max;

            if (count < range.min)
                ownValue[value.valueType] = range.min;
        }

        this.next?.handle?.(value, valueService);
    }
}