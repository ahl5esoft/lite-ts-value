import { EnumFactoryBase } from 'lite-ts-enum';
import { RpcBase } from 'lite-ts-rpc';

import { ExpireTimeHandlerBase } from './expire-time-handler-base';
import { ValueHandlerContext } from './value-handler-context';
import { Time } from './value-type-data';

export class UpdateTargetTimeValueHandler extends ExpireTimeHandlerBase {
    public constructor(
        protected getNowFunc: () => Promise<number>,
        private m_Rpc: RpcBase,
        private m_UserID: string,
        enumFactory: EnumFactoryBase
    ) {
        super(
            getNowFunc,
            enumFactory
        );
    }

    protected async onHandle(ctx: ValueHandlerContext, time: Time) {
        if (!time.targetType)
            return;

        const now = await this.getNowFunc();
        const ownValue = await ctx.valueService.ownValue;
        if (now > (ownValue[time.expireOnValueType] || 0))
            ownValue[ctx.value.valueType] = 0;

        const res = await this.m_Rpc.call<number>({
            route: `/${time.targetType.app}/get-expire-time`,
            body: {
                areaNo: ctx.areaNo ?? 0,
                userID: this.m_UserID,
                ext: time.targetType.ext
            }
        });
        ownValue[time.expireOnValueType] = res.data;
    }
}