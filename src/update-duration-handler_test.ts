import { deepStrictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { UpdateDurationValueHandler as Self } from './update-duration-handler';
import { ValueService } from './value-service';

describe('src/update-duration-handler.ts', () => {
    describe('.handleDiff(value: Value, valueService: ValueService, durationValueType: number, time: number)', () => {
        it('ok', async () => {
            const self = new Self(
                null,
                async () => 100,
            );

            const ownValue = {};
            const mockValueService = new Mock<ValueService>({
                ownValue
            });
            const fn = Reflect.get(self, 'handleDiff').bind(self) as (value: any, valueService: ValueService, durationValueType: number, time: number) => Promise<void>;
            await fn(
                {
                    count: 1,
                    valueType: 2
                },
                mockValueService.actual,
                3,
                1
            );
            deepStrictEqual(ownValue, {
                2: 0,
                3: 101
            });
        });
    });
});