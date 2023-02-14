import { deepStrictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { IEnum, IEnumFactory } from './i-enum-factory';
import { UpdateRangeHandler as Self } from './update-range-handler';
import { ValueTypeData } from './value-type-data';

describe('src/update-range-handler.ts', () => {
    describe('.handle(value: IValue)', () => {
        it('max', async () => {
            const mockEnumFactory = new Mock<IEnumFactory>();
            const ownValue = {
                2: 100
            };
            const self = new Self(
                mockEnumFactory.actual,
                Promise.resolve(ownValue),
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

            await self.handle({
                count: 1,
                valueType: 2
            });
            deepStrictEqual(ownValue, {
                2: 10
            });
        });

        it('min', async () => {
            const mockEnumFactory = new Mock<IEnumFactory>();
            const ownValue = {
                2: 0
            };
            const self = new Self(
                mockEnumFactory.actual,
                Promise.resolve(ownValue),
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

            await self.handle({
                count: 1,
                valueType: 2
            });
            deepStrictEqual(ownValue, {
                2: 5
            });
        });
    });
});