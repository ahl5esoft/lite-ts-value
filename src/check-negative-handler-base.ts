import { IValue } from './i-value';
import { ValueHandelrBase } from './value-hanlder-base';

export interface INegative {
    readonly isNegative: boolean;
}

export abstract class CheckNegativeHandlerBase extends ValueHandelrBase {
    public constructor(
        private m_Negative: Promise<INegative>,
        private m_OwnValue: Promise<{ [valueType: number]: number }>,
    ) {
        super();
    }

    public async handle(value: IValue) {
        const ownValue = await this.m_OwnValue;
        const count = ownValue?.[value.valueType] ?? 0;
        const negateive = await this.m_Negative;
        if (count < 0 && !negateive?.isNegative)
            throw this.createNotEnoughError(value.count, count - value.count, value.valueType);

        await this.next?.handle?.(value);
    }

    protected abstract createNotEnoughError(consume: number, count: number, valueType: number): Error;
}