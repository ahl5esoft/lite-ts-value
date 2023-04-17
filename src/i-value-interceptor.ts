import { ValueHandlerContext } from './value-handler-context';

export interface IValueInterceptor<T> {
    intercept(option: ValueHandlerContext): Promise<T>;
}