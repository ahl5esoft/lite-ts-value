import { IUnitOfWork } from 'lite-ts-db';

import { Value } from './value';
import { ValueService } from './value-service';

export type ValueHandlerContext = {
    value: Value;
    valueService: ValueService;
    areaNo?: number;
    uow?: IUnitOfWork;
};