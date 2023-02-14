import { IEnumFactory } from './i-enum-factory';
import { IValue } from './i-value';
import { ValueHandelrBase } from './value-hanlder-base';
import { ValueTypeData } from './value-type-data';

export class UpdateIsReplaceHandler extends ValueHandelrBase {
    public constructor(
        private m_EnumFactory: IEnumFactory,
        private m_OwnValue: Promise<{ [valueType: number]: number }>,
    ) {
        super();
    }

    public async handle(value: IValue) {
        const allItem = await this.m_EnumFactory.build<ValueTypeData>('ValueTypeData').allItem;
        if (allItem[value.valueType]?.isReplace) {
            const ownValue = await this.m_OwnValue;
            ownValue[value.valueType] = 0;
        }

        await this.next?.handle?.(value);
    }
}