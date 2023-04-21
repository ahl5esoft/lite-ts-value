import { strictEqual } from 'assert';
import { Enum, EnumFactoryBase } from 'lite-ts-enum';
import { Mock, mockAny } from 'lite-ts-mock';

import { UpdateAutoRecoveryValueHandler as Self } from './update-auto-recovery-handler';
import { Value } from './value';
import { ValueService } from './value-service';
import { ValueTypeData } from './value-type-data';

describe('src/update-auto-recovery-handler.ts', () => {
    describe('.handle(ctx: ValueHandlerContext)', () => {
        it('ok', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(
                mockEnumFactory.actual,
                async () => {
                    return 1678101198;
                },
            );

            const mockEnum = new Mock<Enum<ValueTypeData>>({
                allItem: {
                    1: {
                        value: 1,
                        autoRecovery: {
                            limitValueType: 2,
                            countdownOnValueType: 3,
                            interval: 10
                        }
                    },
                    2: {
                        value: 2,
                    },
                    3: {
                        value: 3,
                        isReplace: true
                    }
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build({
                    app: 'config',
                    areaNo: undefined,
                    ctor: ValueTypeData
                }),
                mockEnum.actual
            );

            const values = {
                1: 15
            };
            const mockValueService = new Mock<ValueService>({
                ownValue: Promise.resolve(values),
                async update(_, valueList: Value[]) {
                    for (const r of valueList) {
                        values[r.valueType] += r.count;
                    }
                }
            });
            mockValueService.expectReturn(
                r => r.getCount(null, 3),
                1678101108
            );
            mockValueService.expectReturn(
                r => r.getCount(null, 2),
                20
            );
            mockValueService.expectReturn(
                r => r.update(null, mockAny),
                undefined
            );

            const value = {
                count: 1,
                valueType: 1
            };
            await self.handle({
                uow: null,
                value: value,
                valueService: mockValueService.actual
            });
            strictEqual(value.count, -4);
        });
    });
});