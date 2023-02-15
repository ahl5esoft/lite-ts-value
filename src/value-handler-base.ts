import { IValue } from './i-value';

export abstract class ValueHandlerBase {
    protected next: ValueHandlerBase;

    public setNext(next: ValueHandlerBase) {
        return this.next = next;
    }

    public abstract handle(value: IValue): Promise<void>;
}