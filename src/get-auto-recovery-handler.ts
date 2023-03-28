import { EnumFactoryBase } from 'lite-ts-enum';

import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { ValueTypeData } from './value-type-data';

export class GetAutoRecoveryValueHandler extends ValueHandlerBase {
    public constructor(
        private enumFactory: EnumFactoryBase,
        private getNowFunc: () => Promise<number>,
    ) {
        super();
    }

    public async handle(option: ValueHandlerOption) {
        const allItem = await this.enumFactory.build<ValueTypeData>(ValueTypeData.ctor, option.areaNo).allItem;
        const autoRecovery = allItem[option.value.valueType]?.autoRecovery;
        if (autoRecovery) {
            const countdownOn = await option.valueService.getCount(option.uow, autoRecovery.countdownOnValueType);
            if (countdownOn) {
                const now = await this.getNowFunc();
                const diff = Math.floor((now - countdownOn) / autoRecovery.interval);
                if (diff) {
                    option.value.count += diff;
                    const max = await option.valueService.getCount(option.uow, autoRecovery.limitValueType);
                    if (option.value.count > max)
                        option.value.count = max;
                }
            }
        }

        await this.next?.handle?.(option);
    }
}