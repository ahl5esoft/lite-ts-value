import { strictEqual } from 'assert';
import { Mock, mockAny } from 'lite-ts-mock';

import { GetExpireTimeValueHandler as Self } from './get-expire-time-handler';
import { ValueService } from './value-service';

describe('src/get-expire-time-handler.ts', () => {
    describe('.onHandle(ctx: ValueHandlerOption, time: Time)', () => {
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

            const ctx = {
                uow: null,
                value: {
                    count: 1,
                    valueType: 1
                },
                valueService: mockValueService.actual
            } as any;
            const fn = Reflect.get(self, 'onHandle').bind(self) as (ctx: any, time: any) => Promise<void>;
            await fn(
                ctx,
                {
                    expireOnValueType: 1
                }
            );
            strictEqual(ctx.value.count, 0);
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

            const ctx = {
                uow: null,
                value: {
                    count: 1,
                    valueType: 1
                },
                valueService: mockValueService.actual
            } as any;
            const fn = Reflect.get(self, 'onHandle').bind(self) as (ctx: any, time: any) => Promise<void>;
            await fn(
                ctx,
                {
                    expireOnValueType: 1
                }
            );
            strictEqual(ctx.value.count, 1);
        });
    });
});