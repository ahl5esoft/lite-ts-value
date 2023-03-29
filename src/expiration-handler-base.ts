import { EnumFactoryBase } from 'lite-ts-enum';

import { Value } from './value';
import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { ValueService } from './value-service';
import { ValueTypeData } from './value-type-data';

export abstract class ExpirationHandlerBase extends ValueHandlerBase {

    public constructor(
        protected enumFactory: EnumFactoryBase,
        protected getNowFunc: () => Promise<number>
    ) {
        super();
    }

    public async handle(option: ValueHandlerOption) {
        const allItem = await this.enumFactory.build<ValueTypeData>(ValueTypeData.ctor, option.areaNo).allItem;
        const expiration = allItem[option.value.valueType]?.expiration;
        if (expiration?.valueType) {
            const now = await this.getNowFunc();
            const oldNow = await option.valueService.getCount(option.uow, expiration.valueType);
            const ok = now > oldNow;
            if (ok)
                await this.handleDiff(expiration.valueType, option.value, option.valueService, allItem);
        }
        await this.next?.handle?.(option);
    }

    protected abstract handleDiff(expirationValueType: number, value: Value, valueService: ValueService, allItem: { [no: number]: ValueTypeData; }): Promise<void>;
}