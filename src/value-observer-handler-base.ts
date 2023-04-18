import { IValueObserver } from './i-value-observer';
import { ValueHandlerBase } from './value-handler-base';
import { ValueTypeData } from './value-type-data';

export abstract class ValueInterceptorClientHandlerBase extends ValueHandlerBase {

    public constructor(
        protected m_IsValidFunc: (observer: any) => boolean
    ) {
        super();
    }

    public abstract addObserver(valueTypeOrPredicates: number | ((valueTypeData: ValueTypeData) => boolean), observer: IValueObserver<any>): void;

    public abstract removeObserver(observer: IValueObserver<any>, valueType?: number): void;
}