import { INowTime } from './i-now-time';
import { IValue } from './i-value';
import { ValueServiceBase } from './value-service-base';

export class DelegateValueService extends ValueServiceBase {
    public constructor(
        private m_GetCountFunc: (valueType: number) => Promise<number>,
        private m_UpdateAction: (value: IValue) => Promise<void>,
        nowTime: INowTime,
        notEnoughtErrorCode: number,
    ) {
        super(nowTime, notEnoughtErrorCode);
    }

    public async getCount(valueType: number) {
        return this.m_GetCountFunc(valueType);
    }

    public async update(values: IValue[]) {
        if (!values?.length)
            return;

        for (const r of values) {
            await this.m_UpdateAction(r);
        }
    }
}