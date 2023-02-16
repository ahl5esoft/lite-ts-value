import { IEnumFactory } from './i-enum-factory';
import { Value } from './value';
import { ValueHandlerBase } from './value-handler-base';
import { ValueService } from './value-service';
import { ValueTypeData } from './value-type-data';

export class UpdateIsReplaceHandler extends ValueHandlerBase {
    public constructor(
        private m_EnumFactory: IEnumFactory,
    ) {
        super();
    }

    public async handle(value: Value, valueService: ValueService) {
        const allItem = await this.m_EnumFactory.build<ValueTypeData>('ValueTypeData').allItem;
        if (allItem[value.valueType]?.isReplace) {
            const ownValue = await valueService.ownValue;
            ownValue[value.valueType] = 0;
        }

        await this.next?.handle?.(value, valueService);
    }
}