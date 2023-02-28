import { ValueHandlerOption } from './value-handler-option';

export abstract class ValueHandlerBase {
    protected next: ValueHandlerBase;

    public setNext(next: ValueHandlerBase) {
        return this.next = next;
    }

    public abstract handle(option: ValueHandlerOption): Promise<void>;
}