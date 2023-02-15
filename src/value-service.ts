import { UpdateCountHandler } from './update-count-handler';
import { ValueHandlerBase } from './value-handler-base';
import { INowTime, ValueServiceBase } from './value-service-base';

export class ValueService extends ValueServiceBase {
    private m_UpdateHandler: ValueHandlerBase;

    public constructor(
        nowTime: INowTime,
        value: Promise<{ [valueType: number]: number }>,
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