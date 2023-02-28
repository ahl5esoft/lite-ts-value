import { IEnumFactory } from './i-enum-factory';
import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { ValueTypeData } from './value-type-data';

export class FilterIsReplaceHandler extends ValueHandlerBase {
    public constructor(
        private m_EnumFactory: IEnumFactory,
    ) {
        super();
    }

    public async handle(option: ValueHandlerOption) {
        const allItem = await this.m_EnumFactory.build<ValueTypeData>('ValueTypeData').allItem;
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