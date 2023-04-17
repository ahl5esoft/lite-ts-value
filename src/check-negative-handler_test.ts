import { deepStrictEqual, strictEqual } from 'assert';
import { Enum, EnumFactoryBase } from 'lite-ts-enum';
import { Mock } from 'lite-ts-mock';

import { CheckNegativeValueHandler as Self, CustomError } from './check-negative-handler';
import { ValueHandlerBase } from './value-handler-base';
import { ValueService } from './value-service';
import { ValueTypeData } from './value-type-data';

describe('src/check-negative-handler.ts', () => {
    describe('.handle(option: ValueHandlerContext)', () => {
        it('ok', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(
                mockEnumFactory.actual,
            );

            const mockValueService = new Mock<ValueService>();
            mockValueService.expectReturn(
                r => r.getCount(null, 3),
                -1
            );

            const mockEnum = new Mock<Enum<ValueTypeData>>({
                allItem: {
                    3: {
                        isNegative: true
                    } as ValueTypeData
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build('ValueTypeData', undefined),
                mockEnum.actual
            );

            const mockNext = new Mock<ValueHandlerBase>();
            self.setNext(mockNext.actual);

            mockNext.expected.handle({
                uow: null,
                value: {
                    count: -2,
                    valueType: 3
                },
                valueService: mockValueService.actual
            });

            await self.handle({
                uow: null,
                value: {
                    count: -2,
                    valueType: 3
                },
                valueService: mockValueService.actual
            });
        });

        it('error', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(
                mockEnumFactory.actual,
            );

            const mockEnum = new Mock<Enum<ValueTypeData>>({
                allItem: {}
            });
            mockEnumFactory.expectReturn(
                r => r.build('ValueTypeData', undefined),
                mockEnum.actual
            );

            let err: CustomError;
            try {
                const mockValueService = new Mock<ValueService>();
                mockValueService.expectReturn(
                    r => r.getCount(null, 3),
                    -1
                );

                await self.handle(
                    {
                        uow: null,
                        value: {
                            count: -2,
                            valueType: 3
                        },
                        valueService: mockValueService.actual
                    }
                );
            } catch (ex) {
                err = ex;
            }
            strictEqual(err.code, Self.notEnoughErrorCode);
            deepStrictEqual(err.data, {
                consume: 2,
                count: 1,
                valueType: 3
            });
        });
    });
});