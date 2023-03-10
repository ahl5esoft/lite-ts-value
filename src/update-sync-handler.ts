import { EnumFactoryBase } from 'lite-ts-enum';

import { ValueHandlerOption } from './value-handler-option';
import { ValueHandlerBase } from './value-handler-base';
import { ValueTypeData } from './value-type-data';

export class UpdateSyncValueHandler extends ValueHandlerBase {
    public constructor(
        private m_EnumFactory: EnumFactoryBase,
    ) {
        super();
    }

    public async handle(option: ValueHandlerOption) {
        const allItem = await this.m_EnumFactory.build<ValueTypeData>('ValueTypeData').allItem;
        const sync = allItem[option.value.valueType]?.sync;
        if (sync?.valueTypes?.length) {
            await option.valueService.update(
                option.uow,
                sync.valueTypes.filter(r => r != option.value.valueType).map(r => {
                    return {
                        ...option.value,
                        valueType: r
                    };
                })
            );
        }

        await this.next?.handle?.(option);
    }
}