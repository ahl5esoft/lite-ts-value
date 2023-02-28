import { IEnumFactory } from './i-enum-factory';
import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { ValueTypeData } from './value-type-data';

export class UpdateIsReplaceHandler extends ValueHandlerBase {
    public constructor(
        private m_EnumFactory: IEnumFactory,
    ) {
        super();
    }

    public async handle(options: ValueHandlerOption) {
        const allItem = await this.m_EnumFactory.build<ValueTypeData>('ValueTypeData').allItem;
        if (allItem[options.value.valueType]?.isReplace) {
            const ownValue = await options.valueService.ownValue;
            ownValue[options.value.valueType] = 0;
        }

        await this.next?.handle?.(options);
    }
}