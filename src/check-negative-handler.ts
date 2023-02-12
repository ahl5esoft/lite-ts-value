import { IValue } from './i-value';
import { BuildNotEnoughErrorFunc } from './not-enough';
import { ValueHandelrBase } from './value-hanlder-base';

interface INegative {
    readonly isNegative: boolean;
}

export class CheckNegativeHandler extends ValueHandelrBase {
    public constructor(
        private m_Negative: Promise<INegative>,
        private m_OwnValue: Promise<{ [valueType: number]: number }>,
        private m_BuildNotEnoughErrorFunc: BuildNotEnoughErrorFunc,
    ) {
        super();
    }

    public async handle(value: IValue) {
        const ownValue = await this.m_OwnValue;
        const count = ownValue?.[value.valueType] ?? 0;
        const negateive = await this.m_Negative;
        if (count < 0 && !negateive?.isNegative) {
            throw this.m_BuildNotEnoughErrorFunc(
                value.count,
                count - value.count,
                value.valueType
            );
        }

        await this.next?.handle?.(value);
    }
}