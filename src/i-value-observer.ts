import { ValueHandlerContext } from './value-handler-context';

export interface IValueObserver {
    notify(option: ValueHandlerContext): Promise<void>;
}