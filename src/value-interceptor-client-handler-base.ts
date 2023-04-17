import { ValueHandlerBase } from './value-handler-base';
import { IValueInterceptor } from './value-interceptor-handler-base';
import { ValueTypeData } from './value-type-data';

export abstract class ValueInterceptorClientHandlerBase extends ValueHandlerBase {
    public ctor: string;

    public abstract addObserver(valueTypeOrPredicates: number | ((valueTypeData: ValueTypeData) => boolean), observer: IValueInterceptor<any>): void;

    public abstract removeObserver(observer: IValueInterceptor<any>, valueType?: number): void;
}