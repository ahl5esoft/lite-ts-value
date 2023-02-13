import { IValue } from './i-value';
import { IValueService } from './i-value-service';
import { ValueHandelrBase } from './value-hanlder-base';

interface ISync {
    valueTypes: number[];
}

export class UpdateSyncHandler extends ValueHandelrBase {
    public constructor(
        private m_ValueService: IValueService,
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