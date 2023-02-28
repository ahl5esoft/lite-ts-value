import { IUnitOfWork } from './i-unit-of-work';
import { Value } from './value';
import { ValueService } from './value-service';

export interface ValueHandlerOption {
    uow?: IUnitOfWork,
    value: Value,
    valueService: ValueService;
}