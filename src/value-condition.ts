import { Value } from './value';

export type ValueCondition = Value & {
    op: string;
};