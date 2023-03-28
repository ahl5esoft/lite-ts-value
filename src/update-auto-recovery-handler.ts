import { EnumFactoryBase } from 'lite-ts-enum';

import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { ValueTypeData } from './value-type-data';

export class UpdateAutoRecoveryValueHandler extends ValueHandlerBase {
    public constructor(
        private m_EnumFactory: EnumFactoryBase,
        private m_GetNowFunc: () => Promise<number>
    ) {
        super();
    }

    public async handle(option: ValueHandlerOption) {
        const allItem = await this.m_EnumFactory.build<ValueTypeData>(ValueTypeData.ctor, option.areaNo).allItem;
        const autoRecovery = allItem[option.value.valueType]?.autoRecovery;
        if (autoRecovery) {
            const countdownOn = await option.valueService.getCount(option.uow, autoRecovery.countdownOnValueType);
            const now = await this.m_GetNowFunc();
            const diff = Math.floor((now - countdownOn) / autoRecovery.interval);
            const max = await option.valueService.getCount(option.uow, autoRecovery.limitValueType);
            const ownValue = await option.valueService.ownValue;
            if (diff) {
                ownValue[autoRecovery.countdownOnValueType] = now;
                await option.valueService.update(option.uow, [
                    {
                        count: diff,
                        valueType: option.value.valueType,
                        source: `${option.value.source}[定时恢复]`
                    }
                ]);
            }

            if (ownValue[option.value.valueType] + option.value.count > max)
                option.value.count = max - ownValue[option.value.valueType];
        }

        await this.next?.handle?.(option);
    }
}