import { EnumFactoryBase } from 'lite-ts-enum';
import { RpcBase } from 'lite-ts-rpc';

import { ExpireTimeHanglerBase } from './expire-time-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { Time } from './value-type-data';

export class UpdateTargetTimeValueHandler extends ExpireTimeHanglerBase {
    constructor(
        protected getNowFunc: () => Promise<number>,
        private rpc: RpcBase,
        private userID: string,
        m_EnumFactory: EnumFactoryBase
    ) {
        super(
            getNowFunc,
            m_EnumFactory
        );
    }

    protected async handleDiff(option: ValueHandlerOption, time: Time) {
        if (!time.targetType)
            return;

        const now = await this.getNowFunc();
        const ownValue = await option.valueService.ownValue;
        const res = await this.rpc.callWithoutThrow<number>({
            route: `/${time.targetType.app}/get-expire-time`,
            body: {
                areaNo: option.areaNo ?? 0,
                userID: this.userID,
                ext: time.targetType.ext
            }
        });
        ownValue[time.expiredOnValueType] = res.data;
        if (now > ownValue[time.expiredOnValueType])
            ownValue[option.value.valueType] = 0;
    }
}