import { IValue } from './i-value';
import { ValueHandlerBase } from './value-handler-base';

export class UpdateCountHandler extends ValueHandlerBase {
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