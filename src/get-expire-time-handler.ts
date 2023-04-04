import { ExpireTimeChange } from './expire-time-change';
import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerOption } from './value-handler-option';

export class GetExpireTimeValueHandler extends ValueHandlerBase {

    constructor(
        private getExpireChangeFunc: (valueType: number) => Promise<ExpireTimeChange>,
        private getNowFunc: () => Promise<number>
    ) {
        super();
    }

    public async handle(option: ValueHandlerOption) {
        const change = await this.getExpireChangeFunc(option.value.valueType);
        const now = await this.getNowFunc();
        if (now > change.expireTime)
            option.value.count = 0;

        await this.next?.handle?.(option);
    }
}