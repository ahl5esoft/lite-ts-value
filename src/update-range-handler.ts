import { EnumFactoryBase } from 'lite-ts-enum';

import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerContext } from './value-handler-context';
import { ValueTypeData } from './value-type-data';

export class UpdateRangeValueHandler extends ValueHandlerBase {
    public constructor(
        private m_EnumFactory: EnumFactoryBase,
    ) {
        super();
    }

    public async handle(option: ValueHandlerContext) {
        const allItem = await this.m_EnumFactory.build<ValueTypeData>(ValueTypeData.ctor, option.areaNo).allItem;
        const range = allItem[option.value.valueType]?.range;
        if (range) {
            const count = await option.valueService.getCount(option.uow, option.value.valueType);
            const ownValue = await option.valueService.ownValue;
            if (count > range.max)
                ownValue[option.value.valueType] = range.max;

            if (count < range.min)
                ownValue[option.value.valueType] = range.min;
        }

        await this.next?.handle?.(option);
    }
}