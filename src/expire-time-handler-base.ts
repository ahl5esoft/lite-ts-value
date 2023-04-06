import { EnumFactoryBase } from 'lite-ts-enum';

import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { Time, ValueTypeData } from './value-type-data';

export abstract class ExpireTimeHandlerBase extends ValueHandlerBase {

    public constructor(
        protected getNowFunc: () => Promise<number>,
        private m_EnumFactory: EnumFactoryBase
    ) {
        super();
    }

    public async handle(option: ValueHandlerOption) {
        const allItem = await this.m_EnumFactory.build<ValueTypeData>(ValueTypeData.ctor, option.areaNo).allItem;
        const time = allItem[option.value.valueType]?.time;
        if (time?.expiredOnValueType)
            await this.handling(option, time);

        await this.next?.handle?.(option);
    }

    protected abstract handling(option: ValueHandlerOption, time: Time): Promise<void>;
}