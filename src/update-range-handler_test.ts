import { deepStrictEqual } from 'assert';
import { Enum, EnumFactoryBase } from 'lite-ts-enum';
import { Mock } from 'lite-ts-mock';

import { UpdateRangeValueHandler as Self } from './update-range-handler';
import { ValueService } from './value-service';
import { ValueTypeData } from './value-type-data';

describe('src/update-range-handler.ts', () => {
    describe('.handle(option: ValueHandlerOption)', () => {
        it('max', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(
                mockEnumFactory.actual,
            );

            const mockEnum = new Mock<Enum<ValueTypeData>>({
                allItem: {
                    2: {
                        range: {
                            max: 10,
                            min: 0
                        }
                    } as ValueTypeData
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build('ValueTypeData', undefined),
                mockEnum.actual
            );

            const ownValue = {
                2: 0
            };
            const mockValueService = new Mock<ValueService>({
                ownValue
            });

            mockValueService.expectReturn(
                r => r.getCount(null, 2),
                15
            );

            await self.handle({
                uow: null,
                value: {
                    count: 1,
                    valueType: 2
                },
                valueService: mockValueService.actual
            });
            deepStrictEqual(ownValue, {
                2: 10
            });
        });

        it('min', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(
                mockEnumFactory.actual,
            );

            const mockEnum = new Mock<Enum<ValueTypeData>>({
                allItem: {
                    2: {
                        range: {
                            max: 10,
                            min: 5
                        }
                    } as ValueTypeData
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build('ValueTypeData', undefined),
                mockEnum.actual
            );

            const ownValue = {
                2: 0
            };
            const mockValueService = new Mock<ValueService>({
                ownValue
            });
            mockValueService.expectReturn(
                r => r.getCount(null, 2),
                0
            );

            await self.handle(
                {
                    uow: null,
                    value: {
                        count: 1,
                        valueType: 2
                    },
                    valueService: mockValueService.actual
                }
            );
            deepStrictEqual(ownValue, {
                2: 5
            });
        });
    });
});