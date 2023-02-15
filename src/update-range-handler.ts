import { IEnumFactory } from './i-enum-factory';
import { IValue } from './i-value';
import { ValueHandlerBase } from './value-handler-base';
import { ValueTypeData } from './value-type-data';

export class UpdateRangeHandler extends ValueHandlerBase {
    public constructor(
        private m_EnumFactory: IEnumFactory,
        private m_OwnValue: Promise<{ [valueType: number]: number }>,
    ) {
        super();
    }

    public async handle(value: IValue) {
        const allItem = await this.m_EnumFactory.build<ValueTypeData>('ValueTypeData').allItem;
        const range = allItem[value.valueType]?.range;
        if (range) {
            const ownValue = await this.m_OwnValue;
            const count = ownValue?.[value.valueType] ?? 0;
            if (count > range.max)
                ownValue[value.valueType] = range.max;

            if (count < range.min)
                ownValue[value.valueType] = range.min;
        }

        this.next?.handle?.(value);
    }
}