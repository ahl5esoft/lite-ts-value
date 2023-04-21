import { deepStrictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { UpdateTimeValueHandler as Self } from './update-time-handler';
import { Value } from './value';
import { ValueService } from './value-service';

describe('src/update-time-handler.ts', () => {
    describe('.handleDiff(value: Value, valueService: ValueService, timeValueType: number)', () => {
        it('ok', async () => {
            const self = new Self(
                null,
                null,
                async () => 100,
            );

            const ownValue = {
                2: 11
            };
            const mockValueService = new Mock<ValueService>({
                ownValue
            });
            const fn = Reflect.get(self, 'handleDiff').bind(self) as (_: number, __: Value, ___: ValueService) => Promise<void>;
            await fn(3, {
                count: 1,
                valueType: 2
            }, mockValueService.actual);
            deepStrictEqual(ownValue, {
                2: 0,
                3: 100,
            });
        });
    });
});