import { deepStrictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { UpdateDurationTimeValueHandler as Self } from './update-duration-time-handler';
import { ValueService } from './value-service';

describe('src/update-duration-time-handler.ts', () => {
    describe('.handleDiff(value: Value, valueService: ValueService, time: Time)', () => {
        it('exist duration', async () => {
            const self = new Self(
                null,
                async () => 100,
            );

            const ownValue = {};
            const mockValueService = new Mock<ValueService>({
                ownValue
            });
            const fn = Reflect.get(self, 'handleDiff').bind(self) as (value: any, valueService: any, time: any) => Promise<void>;
            await fn(
                {
                    count: 1,
                    valueType: 2
                },
                mockValueService.actual,
                {
                    duration: 1,
                    expiredOnValueType: 3
                }
            );
            deepStrictEqual(ownValue, {
                2: 0,
                3: 101
            });
        });

        it('not duration', async () => {
            const self = new Self(
                null,
                null,
            );

            const ownValue = {};
            const mockValueService = new Mock<ValueService>({
                ownValue
            });
            const fn = Reflect.get(self, 'handleDiff').bind(self) as (value: any, valueService: any, time: any) => Promise<void>;
            await fn(
                {
                    count: 1,
                    valueType: 2
                },
                mockValueService.actual,
                {}
            );
            deepStrictEqual(ownValue, {});
        });
    });
});