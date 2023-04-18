import { EnumFactoryBase } from 'lite-ts-enum';

import { IValueObserver } from './i-observer';
import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerContext } from './value-handler-context';
import { ValueTypeData } from './value-type-data';

export class ValueObserverHandler extends ValueHandlerBase {
    public static ctor = 'ValueObserverHandler';

    private m_Observers: IValueObserver[] = [];

    public constructor(
        private m_EnumFactory: EnumFactoryBase,
        private m_IsValidPredicate: (observer: any) => boolean,
    ) {
        super();
    }

    public addObserver(observer: IValueObserver) {
        const isExist = this.m_Observers.some(r => r == observer);
        if (isExist)
            return;

        this.m_Observers.push(observer);
    }

    public async handle(ctx: ValueHandlerContext) {
        const allItem = await this.m_EnumFactory.build<ValueTypeData>(ValueTypeData.ctor, ctx.areaNo).allItem;
        for (const r of this.m_Observers) {
            if (!this.m_IsValidPredicate(r))
                continue;

            const ok = await r.predicate(allItem[ctx.value.valueType]);
            if (!ok)
                continue;

            const res = await r.notify(ctx.value);
            if (typeof res == 'boolean' && res)
                return;
        }

        await this.next?.handle(ctx);
    }

    public removeObserver(observer: IValueObserver) {
        this.m_Observers = this.m_Observers.filter(r => {
            return this.m_IsValidPredicate(r) && r != observer;
        });
    }
}