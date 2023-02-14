import { IEnumFactory } from './i-enum-factory';
import { IValue } from './i-value';
import { ValueHandelrBase } from './value-hanlder-base';
import { ValueServiceBase } from './value-service-base';
import { ValueTypeData } from './value-type-data';

export class UpdateSyncHandler extends ValueHandelrBase {
    public constructor(
        private m_EnumFactory: IEnumFactory,
        private m_ValueService: ValueServiceBase,
    ) {
        super();
    }

    public async handle(value: IValue) {
        const allItem = await this.m_EnumFactory.build<ValueTypeData>('ValueTypeData').allItem;
        const sync = allItem[value.valueType]?.sync;
        if (sync?.valueTypes?.length) {
            await this.m_ValueService.update(
                sync.valueTypes.filter(r => r != value.valueType).map(r => {
                    return {
                        ...value,
                        valueType: r
                    };
                })
            );
        }

        await this.next?.handle?.(value);
    }
}