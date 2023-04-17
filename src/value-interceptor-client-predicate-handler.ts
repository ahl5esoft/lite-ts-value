import { EnumFactoryBase } from 'lite-ts-enum';

import { ValueHandlerOption } from './value-handler-option';
import { ValueInterceptorClientHandlerBase } from './value-interceptor-client-handler-base';
import { IValueInterceptor } from './value-interceptor-handler-base';
import { ValueTypeData } from './value-type-data';

export class ValueInterceptorClientPredicateHandler extends ValueInterceptorClientHandlerBase {
    private m_Metadata: {
        ctor: IValueInterceptor<any>;
        predicates: (valueType: ValueTypeData) => boolean;
    }[] = [];

    public ctor: string = 'ValueInterceptorClientPredicateHandler';

    constructor(
        private m_EnumFactory: EnumFactoryBase
    ) {
        super();
    }

    public addObserver(predicates: (valueTypeData: ValueTypeData) => boolean, observer: IValueInterceptor<any>) {
        this.m_Metadata.push({
            ctor: observer,
            predicates,
        });
    }

    public async handle(option: ValueHandlerOption) {
        if (this.m_Metadata.length) {
            const allItem = await this.m_EnumFactory.build<ValueTypeData>(ValueTypeData.ctor, option.areaNo).allItem;
            if (allItem[option.value.valueType]) {
                for (const r of this.m_Metadata) {
                    const ok = r.predicates(allItem[option.value.valueType]);
                    if (ok) {
                        await r.ctor.intercept(option);
                    }
                }
            }

        }

        await this.next?.handle(option);
    }

    public removeObserver(observer: IValueInterceptor<any>) {
        this.m_Metadata = this.m_Metadata.filter(r => r.ctor != observer);
    }
}