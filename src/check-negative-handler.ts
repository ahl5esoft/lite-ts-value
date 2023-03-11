import { EnumFactoryBase } from 'lite-ts-enum';

import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { ValueTypeData } from './value-type-data';

export class CustomError extends Error {
    public constructor(public code: number, public data?: any) {
        super('');
    }
}

export class CheckNegativeValueHandler extends ValueHandlerBase {
    public static notEnoughErrorCode = 505;

    public constructor(
        private m_EnumFactory: EnumFactoryBase,
    ) {
        super();
    }

    public async handle(option: ValueHandlerOption) {
        const count = await option.valueService.getCount(option.uow, option.value.valueType);
        const allItem = await this.m_EnumFactory.build<ValueTypeData>('ValueTypeData').allItem;
        if (count < 0 && !allItem[option.value.valueType]?.isNegative) {
            throw new CustomError(CheckNegativeValueHandler.notEnoughErrorCode, {
                consume: Math.abs(option.value.count),
                count: count - option.value.count,
                valueType: option.value.valueType,
            });
        }

        await this.next?.handle?.(option);
    }
}