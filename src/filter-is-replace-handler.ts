import { EnumFactoryBase } from 'lite-ts-enum';

import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerContext } from './value-handler-context';
import { ValueTypeData } from './value-type-data';

export class FilterIsReplaceValueHandler extends ValueHandlerBase {
    public constructor(
        private m_EnumFactory: EnumFactoryBase,
    ) {
        super();
    }

    public async handle(option: ValueHandlerContext) {
        const allItem = await this.m_EnumFactory.build<ValueTypeData>(ValueTypeData.ctor, option.areaNo).allItem;
        if (allItem[option.value.valueType]?.isReplace) {
            const count = await option.valueService.getCount(option.uow, option.value.valueType);
            if (count == option.value.count)
                return;
        } else if (option.value.count == 0) {
            return;
        }

        await this.next.handle(option);
    }
}