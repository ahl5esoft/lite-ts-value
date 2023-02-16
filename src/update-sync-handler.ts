import { IEnumFactory } from './i-enum-factory';
import { Value } from './value';
import { ValueHandlerBase } from './value-handler-base';
import { ValueService } from './value-service';
import { ValueTypeData } from './value-type-data';

export class UpdateSyncHandler extends ValueHandlerBase {
    public constructor(
        private m_EnumFactory: IEnumFactory,
    ) {
        super();
    }

    public async handle(value: Value, valueService: ValueService) {
        const allItem = await this.m_EnumFactory.build<ValueTypeData>('ValueTypeData').allItem;
        const sync = allItem[value.valueType]?.sync;
        if (sync?.valueTypes?.length) {
            await valueService.update(
                sync.valueTypes.filter(r => r != value.valueType).map(r => {
                    return {
                        ...value,
                        valueType: r
                    };
                })
            );
        }

        await this.next?.handle?.(value, valueService);
    }
}