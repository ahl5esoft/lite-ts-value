import { IEnumFactory } from './i-enum-factory';
import { ValueHandlerOption } from './value-handler-option';
import { ValueHandlerBase } from './value-handler-base';
import { ValueTypeData } from './value-type-data';

export class UpdateSyncHandler extends ValueHandlerBase {
    public constructor(
        private m_EnumFactory: IEnumFactory,
    ) {
        super();
    }

    public async handle(options: ValueHandlerOption) {
        const allItem = await this.m_EnumFactory.build<ValueTypeData>('ValueTypeData').allItem;
        const sync = allItem[options.value.valueType]?.sync;
        if (sync?.valueTypes?.length) {
            await options.valueService.update(
                options.uow,
                sync.valueTypes.filter(r => r != options.value.valueType).map(r => {
                    return {
                        ...options.value,
                        valueType: r
                    };
                })
            );
        }

        await this.next?.handle?.(options);
    }
}