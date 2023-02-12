import { deepStrictEqual } from 'assert';

import { UpdateRangeHandler as Self } from './update-range-handler';

describe('src/update-range-handler.ts', () => {
    describe('.handle(value: IValue)', () => {
        it('max', async () => {
            const ownValue = {
                2: 100
            };
            const self = new Self(
                Promise.resolve({
                    max: 10,
                    min: 0
                }),
                Promise.resolve(ownValue),
            );

            await self.handle({
                count: 1,
                valueType: 2
            });
            deepStrictEqual(ownValue, {
                2: 10
            });
        });
        
        it('min', async () => {
            const ownValue = {
                2: 0
            };
            const self = new Self(
                Promise.resolve({
                    max: 10,
                    min: 5
                }),
                Promise.resolve(ownValue),
            );

            await self.handle({
                count: 1,
                valueType: 2
            });
            deepStrictEqual(ownValue, {
                2: 5
            });
        });
    });
});