import { strictEqual } from 'assert';
import { Mock, mockAny } from 'lite-ts-mock';

import { GetExpireTimeValueHandler as Self } from './get-expire-time-handler';
import { ValueService } from './value-service';

describe('src/get-expire-time-handler.ts', () => {
    describe('.handling(option: ValueHandlerOption, time: Time)', () => {
        it('greater than', async () => {
            const self = new Self(
                async () => 100,
                null
            );
            const mockValueService = new Mock<ValueService>();
            mockValueService.expectReturn(
                r => r.getCount(null, mockAny),
                1
            );

            const option = {
                uow: null,
                value: {
                    count: 1,
                    valueType: 1
                },
                valueService: mockValueService.actual
            } as any;
            const fn = Reflect.get(self, 'handling').bind(self) as (option: any, time: any) => Promise<void>;
            await fn(
                option,
                {
                    expiredOnValueType: 1
                }
            );
            strictEqual(option.value.count, 0);
        });

        it('less than', async () => {
            const self = new Self(
                async () => 1,
                null
            );
            const mockValueService = new Mock<ValueService>();
            mockValueService.expectReturn(
                r => r.getCount(null, mockAny),
                100
            );

            const option = {
                uow: null,
                value: {
                    count: 1,
                    valueType: 1
                },
                valueService: mockValueService.actual
            } as any;
            const fn = Reflect.get(self, 'handling').bind(self) as (option: any, time: any) => Promise<void>;
            await fn(
                option,
                {
                    expiredOnValueType: 1
                }
            );
            strictEqual(option.value.count, 1);
        });
    });
});