import { IEnumFactory } from './i-enum-factory';
import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { ValueTypeData } from './value-type-data';

export class GetAutoRecoveryHandler extends ValueHandlerBase {
    public constructor(
        private enumFactory: IEnumFactory,
        private getNowFunc: () => Promise<number>,
    ) {
        super();
    }

    public async handle(option: ValueHandlerOption) {
        const allItem = await this.enumFactory.build<ValueTypeData>('ValueTypeData').allItem;
        const autoRecovery = allItem[option.value.valueType]?.autoRecovery;
        if (autoRecovery) {
            const countdownOn = await option.valueService.getCount(option.uow, autoRecovery.countdownOnValueType);
            if (countdownOn) {
                const now = await this.getNowFunc();
                const diff = Math.floor((now - countdownOn) / autoRecovery.interval);
                if (diff) {
                    await option.valueService.update(option.uow, [{
                        count: diff,
                        valueType: option.value.valueType
                    }]);
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