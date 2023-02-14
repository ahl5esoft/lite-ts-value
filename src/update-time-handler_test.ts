import { deepStrictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';
import moment from 'moment';

import { IEnum, IEnumFactory } from './i-enum-factory';
import { UpdateTimeHandler as Self } from './update-time-handler';
import { ValueTypeData } from './value-type-data';

describe('src/update-time-handler.ts', () => {
    describe('.handleDiff(value: IValue)', () => {
        it('same', async () => {
            const mockEnumFactory = new Mock<IEnumFactory>();
            const res = {
                2: 1
            };
            const self = new Self(
                mockEnumFactory.actual,
                Promise.resolve(0),
                Promise.resolve(res),
            );

            const mockEnum = new Mock<IEnum<ValueTypeData>>({
                allItem: {
                    2: {
                        time: {
                            valueType: 3,
                        }
                    } as ValueTypeData,
                    3: {
                        time: {
                            momentType: 'day'
                        }
                    } as ValueTypeData,
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build('ValueTypeData'),
                mockEnum.actual
            );

            await self.handle({
                count: 3,
                valueType: 2
            });
            deepStrictEqual(res, {
                2: 1,
            });
        });

        it('diff', async () => {
            const mockEnumFactory = new Mock<IEnumFactory>();
            const res = {
                2: 1
            };
            const now = moment().unix();
            const self = new Self(
                mockEnumFactory.actual,
                Promise.resolve(now),
                Promise.resolve(res),
            );

            const mockEnum = new Mock<IEnum<ValueTypeData>>({
                allItem: {
                    2: {
                        time: {
                            valueType: 3,
                        }
                    } as ValueTypeData,
                    3: {
                        time: {
                            momentType: 'day'
                        }
                    } as ValueTypeData,
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build('ValueTypeData'),
                mockEnum.actual
            );

            await self.handle({
                count: 3,
                valueType: 2
            });
            deepStrictEqual(res, {
                2: 0,
                3: now
            });
        });
    });
});