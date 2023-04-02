import { strictEqual } from 'assert';

import { GetDurationValueHandler as Self } from './get-duration-handler';

describe('src/get-duration-handler.ts', () => {
    describe('.handleDiff(value: Value)', () => {
        it('ok', async () => {
            const self = new Self(null, null);

            const fn = Reflect.get(self, 'handleDiff').bind(self) as (arg: any) => Promise<void>;
            const res = {
                count: 1,
                valueType: 2
            };
            await fn(res);
            strictEqual(res.count, 0);
        });
    });
});