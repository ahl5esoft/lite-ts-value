import moment from 'moment';

import { IEnumFactory } from './i-enum-factory';
import { Value } from './value';
import { ValueHandlerBase } from './value-handler-base';
import { ValueService } from './value-service';
import { ValueTypeData } from './value-type-data';

export abstract class TimeValueHandlerBase extends ValueHandlerBase {
    public constructor(
        protected enumFactory: IEnumFactory,
        protected getNowFunc: () => Promise<number>,
    ) {
        super();
    }

    public async handle(value: Value, valueService: ValueService) {
        const allItem = await this.enumFactory.build<ValueTypeData>('ValueTypeData').allItem;
        const time = allItem[value.valueType]?.time;
        if (time?.valueType) {
            const now = await this.getNowFunc();
            const oldNow = await valueService.getCount(time.valueType);
            const ok = moment.unix(now).isSame(
                moment.unix(oldNow),
                allItem[time.valueType]?.time?.momentType ?? 'day'
            );
            if (!ok)
                await this.handleDiff(time.valueType, value, valueService);
        }

        this.next?.handle?.(value, valueService);
    }

    protected abstract handleDiff(timeValueType: number, value: Value, valueService: ValueService): Promise<void>;
}