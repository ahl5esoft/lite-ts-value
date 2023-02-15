import moment from 'moment';

import { IEnumFactory } from './i-enum-factory';
import { IValue } from './i-value';
import { ValueHandlerBase } from './value-handler-base';
import { ValueTypeData } from './value-type-data';

export abstract class TimeValueHandlerBase extends ValueHandlerBase {
    public constructor(
        protected enumFactory: IEnumFactory,
        protected now: Promise<number>,
        protected ownValue: Promise<{ [valueType: number]: number }>,
    ) {
        super();
    }

    public async handle(value: IValue) {
        const allItem = await this.enumFactory.build<ValueTypeData>('ValueTypeData').allItem;
        const time = allItem[value.valueType]?.time;
        if (time?.valueType) {
            const now = await this.now;
            const ownValue = await this.ownValue;
            const oldNow = ownValue?.[time.valueType] ?? 0;
            const ok = moment.unix(now).isSame(
                moment.unix(oldNow),
                allItem[time.valueType]?.time?.momentType ?? 'day'
            );
            if (!ok)
                await this.handleDiff(value, time.valueType);
        }

        this.next?.handle?.(value);
    }

    protected abstract handleDiff(value: IValue, timeValueType: number): Promise<void>;
}