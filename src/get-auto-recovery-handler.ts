import { IEnumFactory } from './i-enum-factory';
import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { ValueTypeData } from './value-type-data';

export class getAutoRecoveryHandler extends ValueHandlerBase {
    public constructor(
        private enumFactory: IEnumFactory,
        private getNowFunc: () => Promise<number>,
        private getSpiritConfig: () => Promise<{
            internal: number,
        }>

    ) {
        super();
    }

    public async handle(option: ValueHandlerOption) {
        const allItem = await this.enumFactory.build<ValueTypeData>('ValueTypeData').allItem;
        const autoRecovery = allItem[option.value.valueType]?.autoRecovery;
        if (autoRecovery) {
            const countdownOn = await option.valueService.getCount(option.uow, autoRecovery.countdownOnValueType);
            if (countdownOn) {
                const count = await option.valueService.getCount(option.uow, option.value.valueType);
                const cfg = await this.getSpiritConfig();
                const now = await this.getNowFunc();
                const diff = Math.floor((now - countdownOn) / cfg.internal);
                const max = await option.valueService.getCount(option.uow, autoRecovery.limitValueType);
                if (diff && count < max) {
                    const updateValue = count + diff < max ? diff : max - count;
                    await option.valueService.update(option.uow, [{
                        count: updateValue,
                        valueType: option.value.valueType
                    }, {
                        count: updateValue,
                        valueType: option.value.valueType
                    }]);
                    option.value.count += updateValue;
                }
            }
        }

        this.next?.handle?.(option);
    }
}