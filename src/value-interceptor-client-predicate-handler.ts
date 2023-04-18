import { EnumFactoryBase } from 'lite-ts-enum';

import { IValueObserver } from './i-value-observer';
import { ValueHandlerContext } from './value-handler-context';
import { ValueInterceptorClientHandlerBase } from './value-interceptor-client-handler-base';
import { ValueTypeData } from './value-type-data';

export class ValueInterceptorClientPredicateHandler extends ValueInterceptorClientHandlerBase {

    public static ctor = 'ValueInterceptorClientPredicateHandler';

    private m_Observer: {
        ctor: IValueObserver;
        predicate: (valueType: ValueTypeData) => boolean;
    }[] = [];

    public constructor(
        protected m_IsValidFunc: (observer: any) => boolean,
        private m_EnumFactory: EnumFactoryBase
    ) {
        super(m_IsValidFunc);
    }

    public addObserver(predicate: (valueTypeData: ValueTypeData) => boolean, observer: IValueObserver) {
        this.m_Observer.push({
            ctor: observer,
            predicate,
        });
    }

    public async handle(option: ValueHandlerContext) {
        if (this.m_Observer.length) {
            const allItem = await this.m_EnumFactory.build<ValueTypeData>(ValueTypeData.ctor, option.areaNo).allItem;
            if (allItem[option.value.valueType]) {
                for (const r of this.m_Observer) {
                    const ok = r.predicate(allItem[option.value.valueType]);
                    if (ok && this.m_IsValidFunc(r.ctor))
                        await r.ctor.notify(option);
                }
            }

        }

        await this.next?.handle(option);
    }

    public removeObserver(observer: IValueObserver) {
        this.m_Observer = this.m_Observer.filter(r => r.ctor != observer);
    }
}