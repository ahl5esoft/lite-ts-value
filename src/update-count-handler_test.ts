import { deepStrictEqual } from 'assert';
import { UpdateCountHandler as Self } from './update-count-handler';

describe('src/update-count-handler.ts', () => {
    describe('.handle(value: IValue)', () => {
        it('ok', async () => {
            const res = {};
            const self = new Self(
                Promise.resolve(res)
            );

            await self.handle({
                count: 1,
                valueType: 2
            });
            deepStrictEqual(res, {
                2: 1
            });
        });
    });
});