import { ValueHandlerContext } from './value-handler-context';

export interface IObserver<T> {
    // TODO: predicate(valueTypeData: ValueTypeData): Promise<boolean>;
    notify(ctx: ValueHandlerContext): Promise<T>;
}