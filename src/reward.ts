import { Value } from './value';

export type Reward = Value & {
    weight?: number;
};