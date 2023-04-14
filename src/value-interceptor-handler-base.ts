import { EnumFactoryBase } from 'lite-ts-enum';
import Container from 'typedi';

import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { ValueTypeData } from './value-type-data';
import { InterceptorMetadata } from './interceptor-metadata';

export interface IValueInterceptor<T> {
    intercept(option: ValueHandlerOption): Promise<T>;
}

export abstract class ValueInterceptorHandlerBase extends ValueHandlerBase {
    public static wrapperFunc = (interceptor: IValueInterceptor<any>) => interceptor;
    protected abstract get metadata(): InterceptorMetadata;

    public constructor(
        protected enumFactory: EnumFactoryBase,
    ) {
        super();
    };

    public async handle(option: ValueHandlerOption) {
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
            const ok = ValueInterceptorHandlerBase.wrapperFunc(interceptor).intercept(option);
            if (ok)
                return;
        }

        await this.next?.handle(option);
    }

    public static register(typer: {
        metadata: InterceptorMetadata
    }, valueTypeOrPredicate: number | ((valueType: ValueTypeData) => boolean)) {
        return (ctor: new () => IValueInterceptor<any>) => {
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