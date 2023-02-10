import { IValue } from './i-value';

export abstract class ValueHandelrBase {
    protected next: ValueHandelrBase;

    public setNext(next: ValueHandelrBase) {
        return this.next = next;
    }

    public abstract handle(value: IValue): Promise<void>;
}