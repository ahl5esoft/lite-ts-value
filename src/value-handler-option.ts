import { IUnitOfWork } from 'lite-ts-db';

import { Value } from './value';
import { ValueService } from './value-service';

export type ValueHandlerOption = {
    value: Value;
    valueService: ValueService;
    areaNo?: number;
    uow?: IUnitOfWork;
};