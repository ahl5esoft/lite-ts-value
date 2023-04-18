import { Enum, EnumFactoryBase } from 'lite-ts-enum';
import { Mock } from 'lite-ts-mock';

import { GetAutoRecoveryValueHandler as Self } from './get-auto-recovery-handler';
import { ValueHandlerBase } from './value-handler-base';
import { ValueService } from './value-service';
import { ValueTypeData } from './value-type-data';

describe('src/get-auto-recovery-handler.ts', () => {
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
                            countdownOnValueType: 3,
                            interval: 300,
                            limitValueType: 2,
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
                r => r.build('ValueTypeData', undefined),
                mockEnum.actual
            );

            const mockValueService = new Mock<ValueService>();
            mockValueService.expectReturn(
                r => r.getCount(null, 3),
                1678093998
            );
            mockValueService.expectReturn(
                r => r.getCount(null, 2),
                30
            );
            mockValueService.expected.update(null, [{
                count: 24,
                valueType: 1
            }, {
                count: 0,
                valueType: 3
            }]);
            const mockHandler = new Mock<ValueHandlerBase>();
            mockHandler.expected.handle(
                {
                    uow: null,
                    value: {
                        count: 30,
                        valueType: 1
                    },
                    valueService: mockValueService.actual
                }
            );
            self.setNext(mockHandler.actual);
            await self.handle(
                {
                    uow: null,
                    value: {
                        count: 15,
                        valueType: 1
                    },
                    valueService: mockValueService.actual
                }
            );
        });

        it('enough', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(
                mockEnumFactory.actual,
                async () => {
                    return 1678097598;
                },
            );

            const mockEnum = new Mock<Enum<ValueTypeData>>({
                allItem: {
                    1: {
                        value: 1,
                        spirit: {
                            limitValueType: 2,
                            countdownOnValueType: 3
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
                r => r.build('ValueTypeData', undefined),
                mockEnum.actual
            );

            const mockValueService = new Mock<ValueService>();
            mockValueService.expectReturn(
                r => r.getCount(null, 3),
                1678093998
            );
            mockValueService.expectReturn(
                r => r.getCount(null, 1),
                30
            );
            mockValueService.expectReturn(
                r => r.getCount(null, 2),
                30
            );

            const mockHandler = new Mock<ValueHandlerBase>();
            mockHandler.expected.handle(
                {
                    uow: null,
                    value: {
                        count: 30,
                        valueType: 1
                    },
                    valueService: mockValueService.actual
                }
            );
            self.setNext(mockHandler.actual);
            await self.handle(
                {
                    uow: null,
                    value: {
                        count: 30,
                        valueType: 1
                    },
                    valueService: mockValueService.actual
                }
            );
        });
    });
});