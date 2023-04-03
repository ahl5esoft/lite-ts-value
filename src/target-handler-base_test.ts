import { deepStrictEqual, strictEqual } from 'assert';
import { Enum, EnumFactoryBase } from 'lite-ts-enum';
import { Mock, mockAny } from 'lite-ts-mock';

import { TargetHandlerBase } from './target-handler-base';
import { ValueService } from './value-service';
import { ValueTypeData } from './value-type-data';

class Self extends TargetHandlerBase {
    protected async handleDiff() { }
}

describe('src/target-handler-base.ts', () => {
    describe('.handle(option: ValueHandlerOption)', () => {
        it('无 targetValueType', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(
                mockEnumFactory.actual,
                null,
                null,
                ''
            );

            const mockEnum = new Mock<Enum<ValueTypeData>>({
                allItem: {}
            });
            mockEnumFactory.expectReturn(
                r => r.build('ValueTypeData', undefined),
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
                async () => 100,
                null,
                ''
            );

            const allItem = {
                2: {
                    time: {
                        durationValueType: 1
                    }
                } as ValueTypeData,
                1: {
                    time: {
                        durationOn: 2
                    }
                }
            };
            const mockEnum = new Mock<Enum<ValueTypeData>>({
                allItem
            });
            mockEnumFactory.expectReturn(
                r => r.build('ValueTypeData', undefined),
                mockEnum.actual
            );

            const res = {
                count: 0,
                valueType: 1,
            };
            const mockValueService = new Mock<ValueService>();
            mockValueService.expectReturn(
                r => r.getCount(mockAny, mockAny),
                8
            );
            const option = {
                uow: null,
                value: res,
                valueService: mockValueService.actual
            };
            Reflect.set(self, 'handleDiff', (arg: any, arg1: any, arg2: any, arg3: any) => {
                deepStrictEqual(arg, res);
                deepStrictEqual(arg1, mockValueService.actual);
                strictEqual(arg2, 1);
                strictEqual(arg3, 2);
            });

            await self.handle(option);
        });
    });
});