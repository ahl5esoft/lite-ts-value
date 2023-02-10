import { deepStrictEqual } from 'assert';
import moment from 'moment';

import { UpdateTimeHandler as Self } from './update-time-handler';

describe('src/update-time-handler.ts', () => {
    describe('.handleDiff(value: IValue)', () => {
        it('diff', async () => {
            const res = {
                2: 1
            };
            const now = moment().unix();
            const self = new Self(
                Promise.resolve({
                    valueType: 3,
                    momentType: 'day'
                }),
                Promise.resolve(now),
                Promise.resolve(res),
            );

            await self.handle({
                count: 3,
                valueType: 2
            });
            deepStrictEqual(res, {
                2: 0,
                3: now
            });
        });
    });
});