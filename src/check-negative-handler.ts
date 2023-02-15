import { IEnumFactory } from './i-enum-factory';
import { IValue } from './i-value';
import { ValueHandlerBase } from './value-handler-base';
import { ValueTypeData } from './value-type-data';

export class CustomError extends Error {
    public constructor(public code: number, public data?: any) {
        super('');
    }
}

export class CheckNegativeHandler extends ValueHandlerBase {
    public static notEnoughErrorCode = 505;

    public constructor(
        private m_EnumFactory: IEnumFactory,
        private m_OwnValue: Promise<{ [valueType: number]: number }>,
    ) {
        super();
    }

    public async handle(value: IValue) {
        const ownValue = await this.m_OwnValue;
        const count = ownValue?.[value.valueType] ?? 0;
        const allItem = await this.m_EnumFactory.build<ValueTypeData>('ValueTypeData').allItem;
        if (count < 0 && !allItem[value.valueType]?.isNegative) {
            throw new CustomError(CheckNegativeHandler.notEnoughErrorCode, {
                consume: Math.abs(value.count),
                count: count - value.count,
                valueType: value.valueType,
            });
        }

        await this.next?.handle?.(value);
    }
}