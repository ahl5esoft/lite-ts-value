import { IValue } from './i-value';
import { ValueHandelrBase } from './value-hanlder-base';

export class UpdateCountHandler extends ValueHandelrBase {
    public constructor(
        protected ownValue: Promise<{ [valueType: number]: number }>,
    ) {
        super();
    }

    public async handle(value: IValue) {
        const ownValue = await this.ownValue;
        ownValue[value.valueType] ??= 0;
        ownValue[value.valueType] += value.count;
    }
}