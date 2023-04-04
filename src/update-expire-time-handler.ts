import { EnumFactoryBase } from 'lite-ts-enum';

import { ExpireTimeChange } from './expire-time-change';
import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { ValueTypeData } from './value-type-data';

export class UpdateExpireTimeValueHandler extends ValueHandlerBase {

    constructor(
        private enumFactory: EnumFactoryBase,
        private addExpireChangeFunc: (change: ExpireTimeChange) => Promise<void>,
        private getNowFunc: () => Promise<number>
    ) {
        super();
    }

    public async handle(option: ValueHandlerOption) {
        const allItem = await this.enumFactory.build<ValueTypeData>(ValueTypeData.ctor, option.areaNo).allItem;
        const time = allItem[option.value.valueType]?.time;
        if (time?.expireOn) {
            const now = await this.getNowFunc();
            await this.addExpireChangeFunc({
                count: option.value.count,
                expireTime: now + time.expireOn,
                valueType: option.value.valueType
            } as any);
        }

        await this.next?.handle?.(option);
    }
}