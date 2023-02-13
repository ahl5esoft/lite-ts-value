import { IValue } from './i-value';
import { ValueHandelrBase } from './value-hanlder-base';
import { ValueServiceBase } from './value-service-base';

interface ISync {
    valueTypes: number[];
}

export class UpdateSyncHandler extends ValueHandelrBase {
    public constructor(
        private m_ValueService: ValueServiceBase,
        private m_Sync: Promise<ISync>,
    ) {
        super();
    }

    public async handle(value: IValue) {
        const sync = await this.m_Sync;
        if (sync?.valueTypes?.length) {
            await this.m_ValueService.update(
                sync.valueTypes.filter(r => r != value.valueType).map(r => {
                    return {
                        ...value,
                        valueType: r
                    };
                })
            );
        }

        await this.next?.handle?.(value);
    }
}