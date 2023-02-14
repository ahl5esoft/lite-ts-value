import { strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { GetTimeValueHandler as Self } from './get-time-handler';
import { IEnum, IEnumFactory } from './i-enum-factory';
import { ValueTypeData } from './value-type-data';

describe('src/get-time-handler.ts', () => {
    describe('.handleDiff(value: IValue)', () => {
        it('same', async () => {
            const mockEnumFactory = new Mock<IEnumFactory>();
            const self = new Self(
                mockEnumFactory.actual,
                Promise.resolve(0),
                Promise.resolve({})
            );

            const mockEnum = new Mock<IEnum<ValueTypeData>>({
                allItem: {
                    2: {
                        time: {
                            valueType: 3
                        }
                    } as ValueTypeData,
                    3: {
                        time: {
                            momentType: 'day'
                        }
                    } as ValueTypeData
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build('ValueTypeData'),
                mockEnum.actual
            );

            const res = {
                count: 1,
                valueType: 2,
            };
            await self.handle(res);
            strictEqual(res.count, 1);
        });

        it('diff', async () => {
            const mockEnumFactory = new Mock<IEnumFactory>();
            const self = new Self(
                mockEnumFactory.actual,
                Promise.resolve(0),
                Promise.resolve({
                    1: 11,
                    3: Date.now()
                })
            );

            const mockEnum = new Mock<IEnum<ValueTypeData>>({
                allItem: {
                    2: {
                        time: {
                            valueType: 3
                        }
                    } as ValueTypeData,
                    3: {
                        time: {
                            momentType: 'day'
                        }
                    } as ValueTypeData
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build('ValueTypeData'),
                mockEnum.actual
            );

            const res = {
                count: 1,
                valueType: 2,
            };
            await self.handle(res);
            strictEqual(res.count, 0);
        });
    });
});