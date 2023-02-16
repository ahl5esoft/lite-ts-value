import { deepStrictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { IEnum, IEnumFactory } from './i-enum-factory';
import { UpdateRangeHandler as Self } from './update-range-handler';
import { ValueService } from './value-service';
import { ValueTypeData } from './value-type-data';

describe('src/update-range-handler.ts', () => {
    describe('.handle(value: IValue)', () => {
        it('max', async () => {
            const mockEnumFactory = new Mock<IEnumFactory>();
            const self = new Self(
                mockEnumFactory.actual,
            );

            const mockEnum = new Mock<IEnum<ValueTypeData>>({
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
                r => r.build('ValueTypeData'),
                mockEnum.actual
            );

            const ownValue = {
                2: 0
            };
            const mockValueService = new Mock<ValueService>({
                ownValue
            });

            mockValueService.expectReturn(
                r => r.getCount(2),
                15
            );

            await self.handle({
                count: 1,
                valueType: 2
            }, mockValueService.actual);
            deepStrictEqual(ownValue, {
                2: 10
            });
        });

        it('min', async () => {
            const mockEnumFactory = new Mock<IEnumFactory>();
            const self = new Self(
                mockEnumFactory.actual,
            );

            const mockEnum = new Mock<IEnum<ValueTypeData>>({
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
                r => r.build('ValueTypeData'),
                mockEnum.actual
            );

            const ownValue = {
                2: 0
            };
            const mockValueService = new Mock<ValueService>({
                ownValue
            });
            mockValueService.expectReturn(
                r => r.getCount(2),
                0
            );

            await self.handle({
                count: 1,
                valueType: 2
            }, mockValueService.actual);
            deepStrictEqual(ownValue, {
                2: 5
            });
        });
    });
});