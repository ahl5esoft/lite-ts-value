import { strictEqual } from 'assert';

import { GetExpirationValueHandler as Self } from './get-expiration-handler';
import { Value } from './value';

describe('src/get-expiration-handler.ts', () => {
    describe('.handleDiff(_: number, value: Value)', () => {
        it('ok', async () => {
            const self = new Self(null, null);

            const fn = Reflect.get(self, 'handleDiff').bind(self) as (_: Value) => Promise<void>;
            const res: Value = {
                count: 1,
                valueType: 2
            };
            await fn(res);
            strictEqual(res.count, 0);
        });
    });
});