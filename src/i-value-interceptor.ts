import { ValueHandlerOption } from './value-handler-option';

export interface IValueInterceptor<T> {
    intercept(option: ValueHandlerOption): Promise<T>;
}