import { deepStrictEqual, strictEqual } from 'assert';
import { Enum, EnumFactoryBase } from 'lite-ts-enum';
import { Mock } from 'lite-ts-mock';
import moment from 'moment';

import { TimeValueHandlerBase } from './time-handler-base';
import { ValueService } from './value-service';
import { ValueTypeData } from './value-type-data';

class Self extends TimeValueHandlerBase {
    protected async handleDiff() { }
}

describe('src/time-handler-base.ts', () => {
    describe('.handle(option: ValueHandlerOption)', () => {
        it('无valueTypeTime', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(
                mockEnumFactory.actual,
                null,
            );

            const mockEnum = new Mock<Enum<ValueTypeData>>({
                allItem: {}
            });
            mockEnumFactory.expectReturn(
                r => r.build('ValueTypeData'),
                mockEnum.actual
            );

            let callCount = 0;
            Reflect.set(self, 'handleDiff', () => {
                callCount++;
            });

            const res = {
                count: 1,
                valueType: 2,
            };
            await self.handle({
                uow: null,
                value: res,
                valueService: null
            });
            strictEqual(callCount, 0);
        });

        it('diff', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(
                mockEnumFactory.actual,
                async () => moment().unix(),
            );

            const mockEnum = new Mock<Enum<ValueTypeData>>({
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

            const mockValueService = new Mock<ValueService>();
            mockValueService.expectReturn(
                r => r.getCount(null, 3),
                0
            );

            const res = {
                count: 1,
                valueType: 2,
            };
            Reflect.set(self, 'handleDiff', (arg: any, arg1: any, arg2: any) => {
                strictEqual(arg, 3);
                deepStrictEqual(arg1, res);
                strictEqual(arg2, mockValueService.actual);
            });

            await self.handle({
                uow: null,
                value: res,
                valueService: mockValueService.actual
            });
        });

        it('same', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(
                mockEnumFactory.actual,
                async () => moment().unix(),
            );

            const mockEnum = new Mock<Enum<ValueTypeData>>({
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

            const mockValueService = new Mock<ValueService>();
            mockValueService.expectReturn(
                r => r.getCount(null, 3),
                moment().unix()
            );

            const res = {
                count: 1,
                valueType: 2,
            };
            Reflect.set(self, 'handleDiff', () => { });

            await self.handle({
                uow: null,
                value: res,
                valueService: mockValueService.actual
            });
        });
    });
});