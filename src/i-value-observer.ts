import { ValueHandlerContext } from './value-handler-context';

export interface IValueObserver<T> {
    notify(ctx: ValueHandlerContext): Promise<T>;
}