import { deepStrictEqual, strictEqual } from 'assert';
import { Enum, EnumFactoryBase } from 'lite-ts-enum';
import { Mock } from 'lite-ts-mock';
import moment from 'moment';

import { ExpireTimeHandlerBase } from './expire-time-handler-base';
import { ValueTypeData } from './value-type-data';

class Self extends ExpireTimeHandlerBase {
    protected async handling() { }
}

describe('src/expire-time-handler-base.ts', () => {
    describe('.handle(option: ValueHandlerOption)', () => {
        it('无valueTypeTime', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(
                null,
                mockEnumFactory.actual,
            );

            const mockEnum = new Mock<Enum<ValueTypeData>>({
                allItem: {}
            });
            mockEnumFactory.expectReturn(
                r => r.build('ValueTypeData', undefined),
                mockEnum.actual
            );

            let callCount = 0;
            Reflect.set(self, 'handling', () => {
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
                async () => moment().unix(),
                mockEnumFactory.actual,
            );

            const allItem = {
                2: {
                    time: {
                        expiredOnValueType: 3
                    }
                } as ValueTypeData
            };
            const mockEnum = new Mock<Enum<ValueTypeData>>({
                allItem
            });
            mockEnumFactory.expectReturn(
                r => r.build('ValueTypeData', 0),
                mockEnum.actual
            );

            const res = {
                count: 1,
                valueType: 2,
            };
            Reflect.set(self, 'handling', (arg: any, arg1: any) => {
                deepStrictEqual(arg, {
                    areaNo: 0,
                    uow: null,
                    value: res
                });
                deepStrictEqual(arg1, {
                    expiredOnValueType: 3
                });
            });

            await self.handle({
                areaNo: 0,
                uow: null,
                value: res
            } as any);
        });
    });
});