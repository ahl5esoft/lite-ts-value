import moment from 'moment';

import { IEnumFactory } from './i-enum-factory';
import { Value } from './value';
import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { ValueService } from './value-service';
import { ValueTypeData } from './value-type-data';

export abstract class TimeValueHandlerBase extends ValueHandlerBase {
    public constructor(
        protected enumFactory: IEnumFactory,
        protected getNowFunc: () => Promise<number>,
    ) {
        super();
    }

    public async handle(options: ValueHandlerOption) {
        const allItem = await this.enumFactory.build<ValueTypeData>('ValueTypeData').allItem;
        const time = allItem[options.value.valueType]?.time;
        if (time?.valueType) {
            const now = await this.getNowFunc();
            const oldNow = await options.valueService.getCount(options.uow, time.valueType);
            const ok = moment.unix(now).isSame(
                moment.unix(oldNow),
                allItem[time.valueType]?.time?.momentType ?? 'day'
            );
            if (!ok)
                await this.handleDiff(time.valueType, options.value, options.valueService);
        }

        await this.next?.handle?.(options);
    }

    protected abstract handleDiff(timeValueType: number, value: Value, valueService: ValueService): Promise<void>;
}