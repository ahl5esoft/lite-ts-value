import { notStrictEqual, strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';
import moment from 'moment';

import { IEnum, IEnumFactory } from './i-enum-factory';
import { IValue } from './i-value';
import { TimeHandlerBase } from './time-handler-base';
import { ValueTypeData } from './value-type-data';

class Self extends TimeHandlerBase {
    public callHandleDiffArg: IValue;

    protected async handleDiff(value: IValue) {
        this.callHandleDiffArg = value;
    }
}

describe('src/time-handler-base.ts', () => {
    describe('.handle(res: IValue)', () => {
        it('无valueTypeTime', async () => {
            const mockEnumFactory = new Mock<IEnumFactory>();
            const self = new Self(
                mockEnumFactory.actual,
                null,
                null,
            );

            const mockEnum = new Mock<IEnum<ValueTypeData>>({
                allItem: {}
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
            notStrictEqual(self.callHandleDiffArg, res);
        });

        it('diff', async () => {
            const mockEnumFactory = new Mock<IEnumFactory>();
            const self = new Self(
                mockEnumFactory.actual,
                Promise.resolve(
                    moment().unix(),
                ),
                Promise.resolve({}),
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

            const res = {
                count: 1,
                valueType: 2,
            };
            await self.handle(res);
            strictEqual(res, self.callHandleDiffArg);
        });

        it('same', async () => {
            const mockEnumFactory = new Mock<IEnumFactory>();
            const self = new Self(
                mockEnumFactory.actual,
                Promise.resolve(
                    moment().unix(),
                ),
                Promise.resolve({
                    3: moment().unix(),
                }),
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

            const res = {
                count: 1,
                valueType: 2,
            };
            await self.handle(res);
            notStrictEqual(self.callHandleDiffArg, res);
        });
    });
});