import moment from 'moment';

import { IValue } from './i-value';
import { ValueHandelrBase } from './value-hanlder-base';

interface ITime {
    valueType: number;
    momentType: moment.unitOfTime.StartOf;
}

export abstract class TimeHandlerBase extends ValueHandelrBase {
    public constructor(
        protected time: Promise<ITime>,
        protected now: Promise<number>,
        protected ownValue: Promise<{ [valueType: number]: number }>,
    ) {
        super();
    }

    public async handle(value: IValue) {
        const time = await this.time;
        if (time?.valueType) {
            const now = await this.now;
            const ownValue = await this.ownValue;
            const oldNow = ownValue?.[time.valueType] ?? 0;
            const ok = moment.unix(now).isSame(
                moment.unix(oldNow),
                time.momentType ?? 'day'
            );
            if (!ok)
                await this.handleDiff(value);
        }

        this.next?.handle?.(value);
    }

    protected abstract handleDiff(value: IValue): Promise<void>;
}