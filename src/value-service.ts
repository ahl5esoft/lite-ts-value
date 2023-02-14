import { UpdateCountHandler } from './update-count-handler';
import { ValueHandelrBase } from './value-hanlder-base';
import { INowTime, ValueServiceBase } from './value-service-base';

export class ValueService extends ValueServiceBase {
    private m_UpdateHandler: ValueHandelrBase;

    public constructor(
        nowTime: INowTime,
        value: { [valueType: number]: number },
    ) {
        super(
            nowTime,
            Promise.resolve(value),
        );
    }

    protected getGetCountHandler() {
        return null;
    }

    protected getUpdateHandler() {
        this.m_UpdateHandler ??= new UpdateCountHandler(this.ownValue);
        return this.m_UpdateHandler;
    }
}