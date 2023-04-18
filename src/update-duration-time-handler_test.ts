import { deepStrictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { UpdateDurationTimeValueHandler as Self } from './update-duration-time-handler';
import { ValueService } from './value-service';

describe('src/update-duration-time-handler.ts', () => {
    describe('.onHandle(ctx: ValueHandlerContext, time: Time)', () => {
        it('greater than', async () => {
            const self = new Self(
                async () => 1,
                null,
            );

            const ownValue = {
                2: 1,
                3: 100
            };
            const mockValueService = new Mock<ValueService>({
                ownValue
            });
            const fn = Reflect.get(self, 'onHandle').bind(self) as (ctx: any, time: any) => Promise<void>;
            await fn(
                {
                    value: {
                        count: 1,
                        valueType: 2
                    },
                    valueService: mockValueService.actual,
                },
                {
                    duration: 1,
                    expireOnValueType: 3
                }
            );
            deepStrictEqual(ownValue, {
                2: 1,
                3: 101
            });
        });

        it('less than', async () => {
            const self = new Self(
                async () => 100,
                null,
            );

            const ownValue = {};
            const mockValueService = new Mock<ValueService>({
                ownValue
            });
            const fn = Reflect.get(self, 'onHandle').bind(self) as (ctx: any, time: any) => Promise<void>;
            await fn(
                {
                    value: {
                        count: 1,
                        valueType: 2
                    },
                    valueService: mockValueService.actual,
                },
                {
                    duration: 1,
                    expireOnValueType: 3
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
            const fn = Reflect.get(self, 'onHandle').bind(self) as (ctx: any, time: any) => Promise<void>;
            await fn({}, {});
            deepStrictEqual(ownValue, {});
        });
    });
});