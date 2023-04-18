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

    public async handle(ctx: ValueHandlerContext) {
        if (!this.metadata.valueType[ctx.value.valueType]) {
            const allValueTypeItem = await this.enumFactory.build<ValueTypeData>(ValueTypeData.ctor, ctx.areaNo).allItem;
            if (allValueTypeItem[ctx.value.valueType]) {
                for (const r of this.metadata.predicates) {
                    const ok = r.predicate(allValueTypeItem[ctx.value.valueType]);
                    if (ok)
                        this.metadata.valueType[ctx.value.valueType] = r.ctor;
                }
            }
        }

        if (this.metadata.valueType[ctx.value.valueType]) {
            let interceptor = Container.get(this.metadata.valueType[ctx.value.valueType]);
            Container.remove(this.metadata.valueType[ctx.value.valueType]);
            const ok = ValueInterceptorHandlerBase.wrapperFunc(interceptor).notify(ctx);
            if (ok)
                return;
        }

        await this.next?.handle(ctx);
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