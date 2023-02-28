import { IEnumFactory } from './i-enum-factory';
import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerOption } from './value-handler-option';
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
    ) {
        super();
    }

    public async handle(options: ValueHandlerOption) {
        const count = await options.valueService.getCount(options.uow, options.value.valueType);
        const allItem = await this.m_EnumFactory.build<ValueTypeData>('ValueTypeData').allItem;
        if (count < 0 && !allItem[options.value.valueType]?.isNegative) {
            throw new CustomError(CheckNegativeHandler.notEnoughErrorCode, {
                consume: Math.abs(options.value.count),
                count: count - options.value.count,
                valueType: options.value.valueType,
            });
        }

        await this.next?.handle?.(options);
    }
}