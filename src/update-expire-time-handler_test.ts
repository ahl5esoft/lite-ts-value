import { deepStrictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { UpdateExpireTimeValueHandler as Self } from './update-expire-time-handler';
import { ValueService } from './value-service';

describe('src/update-expire-time-handler.ts', () => {
    describe('.handleDiff(value: Value, valueService: ValueService, time: Time)', () => {
        it('ok', async () => {
            const self = new Self(
                null,
                async () => 100,
            );

            const ownValue = {
                2: 11
            };
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
                    expireOn: 1,
                    expiredOnValueType: 1
                }
            );
            deepStrictEqual(ownValue, {
                2: 0,
                1: 1
            });
        });
    });
});