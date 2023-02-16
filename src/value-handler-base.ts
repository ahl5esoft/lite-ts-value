import { Value } from './value';
import { ValueService } from './value-service';

export abstract class ValueHandlerBase {
    protected next: ValueHandlerBase;

    public setNext(next: ValueHandlerBase) {
        return this.next = next;
    }

    public abstract handle(value: Value, valueService: ValueService): Promise<void>;
}