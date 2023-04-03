import { EnumFactoryBase } from 'lite-ts-enum';
import { RpcBase } from 'lite-ts-rpc';

import { Value } from './value';
import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { ValueService } from './value-service';
import { ValueTypeData } from './value-type-data';

export class TargetType {
    public app: string;
    public ext: any;
    public valueType: number;
}

export abstract class TargetHandlerBase extends ValueHandlerBase {

    public constructor(
        protected enumFactory: EnumFactoryBase,
        protected getNowFunc: () => Promise<number>,
        protected rpc: RpcBase,
        protected userID: string
    ) {
        super();
    }

    public async handle(option: ValueHandlerOption) {
        const allItem = await this.enumFactory.build<ValueTypeData>(ValueTypeData.ctor, option.areaNo).allItem;
        const time = allItem[option.value.valueType]?.time;
        if (time?.targetType?.app) {
            const now = await this.getNowFunc();
            const oldNow = await option.valueService.getCount(option.uow, time.targetType.valueType);
            if (now > oldNow)
                await this.handleDiff(option.value, option.valueService, option.areaNo, time.targetType);
        }

        await this.next?.handle?.(option);
    }

    protected abstract handleDiff(value: Value, valueService: ValueService, areaNo: number, targetType: TargetType): Promise<void>;
}