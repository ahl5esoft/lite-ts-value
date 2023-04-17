import { ValueHandlerOption } from './value-handler-option';

export interface IValueObserver {
    notify(option: ValueHandlerOption): Promise<void>;
}