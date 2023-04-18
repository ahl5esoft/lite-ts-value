import { IObserver } from './i-observer';
import { ValueHandlerBase } from './value-handler-base';
import { ValueTypeData } from './value-type-data';

export abstract class ValueInterceptorClientHandlerBase extends ValueHandlerBase {

    public constructor(
        protected m_IsValidFunc: (observer: any) => boolean
    ) {
        super();
    }

    public abstract addObserver(valueTypeOrPredicates: number | ((valueTypeData: ValueTypeData) => boolean), observer: IObserver<any>): void;

    public abstract removeObserver(observer: IObserver<any>, valueType?: number): void;
}