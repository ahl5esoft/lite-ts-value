
import { EnumFactoryBase } from 'lite-ts-enum';
import Container from 'typedi';

import { IValueObserver } from './i-value-observer';
import { InterceptorMetadata } from './interceptor-metadata';
import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerContext } from './value-handler-context';
import { ValueTypeData } from './value-type-data';

export abstract class ValueInterceptorHandlerBase extends ValueHandlerBase {
    public static wrapperFunc = (interceptor: IValueObserver<any>) => interceptor;
    protected abstract get metadata(): InterceptorMetadata;

    public constructor(
        protected enumFactory: EnumFactoryBase,
    ) {
        super();
    };

    public async handle(option: ValueHandlerContext) {
        if (!this.metadata.valueType[option.value.valueType]) {
            const allValueTypeItem = await this.enumFactory.build<ValueTypeData>(ValueTypeData.ctor, option.areaNo).allItem;
            if (allValueTypeItem[option.value.valueType]) {
                for (const r of this.metadata.predicates) {
                    const ok = r.predicate(allValueTypeItem[option.value.valueType]);
                    if (ok)
                        this.metadata.valueType[option.value.valueType] = r.ctor;
                }
            }
        }

        if (this.metadata.valueType[option.value.valueType]) {
            let interceptor = Container.get(this.metadata.valueType[option.value.valueType]);
            Container.remove(this.metadata.valueType[option.value.valueType]);
            const ok = ValueInterceptorHandlerBase.wrapperFunc(interceptor).notify(option);
            if (ok)
                return;
        }

        await this.next?.handle(option);
    }

    public static register(typer: {
        metadata: InterceptorMetadata;
    }, valueTypeOrPredicate: number | ((valueType: ValueTypeData) => boolean)) {
        return (ctor: new () => IValueObserver<any>) => {
            if (typeof valueTypeOrPredicate == 'number') {
                typer.metadata.valueType[valueTypeOrPredicate] = ctor;
            } else {
                typer.metadata.predicates.push({
                    ctor,
                    predicate: valueTypeOrPredicate,
                });
            }
        };
    }
}