import { EnumFactoryBase } from 'lite-ts-enum';

import { ValueHandlerContext } from './value-handler-context';
import { ValueHandlerBase } from './value-handler-base';
import { ValueTypeData } from './value-type-data';

export class UpdateSyncValueHandler extends ValueHandlerBase {
    public constructor(
        private m_EnumFactory: EnumFactoryBase,
    ) {
        super();
    }

    public async handle(option: ValueHandlerContext) {
        const allItem = await this.m_EnumFactory.build<ValueTypeData>(ValueTypeData.ctor, option.areaNo).allItem;
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

        if (option.value.count < 0 && sync?.absValeuTypes?.length) {
            const count = Math.abs(option.value.count);
            await option.valueService.update(
                option.uow,
                sync.absValeuTypes.filter(r => r != option.value.valueType).map(r => {
                    return {
                        ...option.value,
                        valueType: r,
                        count
                    };
                })
            );
        }

        await this.next?.handle?.(option);
    }
}