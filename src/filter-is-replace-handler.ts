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

    public async handle(options: ValueHandlerOption) {
        const allItem = await this.m_EnumFactory.build<ValueTypeData>('ValueTypeData').allItem;
        if (allItem[options.value.valueType]?.isReplace) {
            const count = await options.valueService.getCount(options.uow, options.value.valueType);
            if (count == options.value.count)
                return;
        } else if (options.value.count == 0) {
            return;
        }

        await this.next.handle(options);
    }
}