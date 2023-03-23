import { EnumFactoryBase } from 'lite-ts-enum';
import { RpcBase } from 'lite-ts-rpc';

import { ILuckyDrawService } from './i-lucky-draw-service';
import { LuckyDrawData } from './lucky-draw-data';
import { LuckyDrawFactoryBase } from './lucky-draw-factory-base';
import { LuckyDrawService } from './lucky-draw-service';

export class LuckyDrawFactory extends LuckyDrawFactoryBase {
    private m_LuckyDrawServices: { [no: number]: ILuckyDrawService; };

    public constructor(
        private m_App: string,
        private m_EnumFactory: EnumFactoryBase,
        private m_Rpc: RpcBase,
    ) {
        super();
    }

    public async findLuckyDrawServices() {
        if (!this.m_LuckyDrawServices) {
            const res = await this.m_Rpc.call<{
                userValues: { [valueType: number]: number; };
                luckyDraws: {
                    entry: LuckyDrawData;
                    values: { [valueType: number]: number; };
                }[];
            }>({
                route: `/${this.m_App}/mh/find`,
            });
            const getNowFunc = async () => {
                return res.userValues[68] || Math.floor(Date.now() / 1000);
            };

            this.m_LuckyDrawServices = res.luckyDraws.reduce((memo, r) => {
                memo[r.entry.value] = new LuckyDrawService(
                    this.m_App,
                    this.m_EnumFactory,
                    r.entry,
                    getNowFunc,
                    r.values,
                    this.m_Rpc,
                );
                return memo;
            }, {});
        }
        return this.m_LuckyDrawServices;
    }
}