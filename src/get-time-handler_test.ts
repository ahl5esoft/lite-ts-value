import { strictEqual } from 'assert';

import { GetTimeHandler as Self } from './get-time-handler';

describe('src/get-time-handler.ts', () => {
    describe('.handleDiff(value: IValue)', () => {
        it('ok', async () => {
            const self = new Self(
                Promise.resolve(null),
                null,
                null,
            );

            const res = {
                count: 1,
                valueType: 2,
            };
            await self.handle(res);
            strictEqual(res.count, 1);
        });
    });
});