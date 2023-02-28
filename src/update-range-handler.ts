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

    public async handle(options: ValueHandlerOption) {
        const allItem = await this.m_EnumFactory.build<ValueTypeData>('ValueTypeData').allItem;
        const range = allItem[options.value.valueType]?.range;
        if (range) {
            const count = await options.valueService.getCount(options.uow, options.value.valueType);
            const ownValue = await options.valueService.ownValue;
            if (count > range.max)
                ownValue[options.value.valueType] = range.max;

            if (count < range.min)
                ownValue[options.value.valueType] = range.min;
        }

        this.next?.handle?.(options);
    }
}