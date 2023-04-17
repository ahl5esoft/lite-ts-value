import { ValueHandlerContext } from './value-handler-context';

export abstract class ValueHandlerBase {
    protected next: ValueHandlerBase;

    public setNext(next: ValueHandlerBase) {
        return this.next = next;
    }

    public abstract handle(option: ValueHandlerContext): Promise<void>;
}