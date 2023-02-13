import { IValue } from './i-value';
import { ValueHandelrBase } from './value-hanlder-base';

export interface IRange {
    readonly max: number;
    readonly min: number;
}

export class UpdateRangeHandler extends ValueHandelrBase {
    public constructor(
        private m_Range: Promise<IRange>,
        private m_OwnValue: Promise<{ [valueType: number]: number }>,
    ) {
        super();
    }

    public async handle(value: IValue) {
        const range = await this.m_Range;
        if (range) {
            const ownValue = await this.m_OwnValue;
            const count = ownValue?.[value.valueType] ?? 0;
            if (count > range.max)
                ownValue[value.valueType] = range.max;

            if (count < range.min)
                ownValue[value.valueType] = range.min;
        }

        this.next?.handle?.(value);
    }
}