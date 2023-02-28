import { strictEqual } from 'assert';

import { GetTimeValueHandler as Self } from './get-time-handler';
import { Value } from './value';

describe('src/get-time-handler.ts', () => {
    describe('.handleDiff(_: number, value: Value)', () => {
        it('ok', async () => {
            const self = new Self(null, null);

            const fn = Reflect.get(self, 'handleDiff').bind(self) as (_: number, __: Value) => Promise<void>;
            const res: Value = {
                count: 1,
                valueType: 2
            };
            await fn(null, res);
            strictEqual(res.count, 0);
        });
    });
});