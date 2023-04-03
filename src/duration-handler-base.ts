import { EnumFactoryBase } from 'lite-ts-enum';

import { Value } from './value';
import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { ValueService } from './value-service';
import { ValueTypeData } from './value-type-data';

export abstract class DurationHandlerBase extends ValueHandlerBase {

    public constructor(
        protected enumFactory: EnumFactoryBase,
        protected getNowFunc: () => Promise<number>
    ) {
        super();
    }

    public async handle(option: ValueHandlerOption) {
        const allItem = await this.enumFactory.build<ValueTypeData>(ValueTypeData.ctor, option.areaNo).allItem;
        const time = allItem[option.value.valueType]?.time;
        if (time?.durationValueType) {
            const now = await this.getNowFunc();
            const oldNow = await option.valueService.getCount(option.uow, time.durationValueType);
            if (now > oldNow)
                await this.handleDiff(option.value, option.valueService, time.durationValueType, allItem[time.durationValueType].time.durationOn);
        }

        await this.next?.handle(option);
    }

    protected abstract handleDiff(value: Value, valueService: ValueService, durationValueType: number, time: number): Promise<void>;
}