import { Mock } from 'lite-ts-mock';

import { GetAutoRecoveryHandler as Self } from './get-auto-recovery-handler';
import { IEnum, IEnumFactory } from './i-enum-factory';
import { ValueHandlerBase } from './value-handler-base';
import { ValueService } from './value-service';
import { ValueTypeData } from './value-type-data';

describe('src/get-spirit.ts', () => {
    describe('.handle(option: ValueHandlerOption)', () => {
        it('ok', async () => {
            const mockEnumFactory = new Mock<IEnumFactory>();
            const self = new Self(
                mockEnumFactory.actual,
                async () => {
                    return 1678101198;
                },
            );

            const mockEnum = new Mock<IEnum<ValueTypeData>>({
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
                r => r.build('ValueTypeData'),
                mockEnum.actual
            );

            const mockValueService = new Mock<ValueService>();
            mockValueService.expectReturn(
                r => r.getCount(null, 3),
                1678093998
            );
            mockValueService.expectReturn(
                r => r.getCount(null, 1),
                15
            );
            mockValueService.expectReturn(
                r => r.getCount(null, 2),
                30
            );
            mockValueService.expected.update(null, [{
                count: 15,
                valueType: 1
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
        it('spirit enough', async () => {
            const mockEnumFactory = new Mock<IEnumFactory>();
            const self = new Self(
                mockEnumFactory.actual,
                async () => {
                    return 1678097598;
                },
            );

            const mockEnum = new Mock<IEnum<ValueTypeData>>({
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
                r => r.build('ValueTypeData'),
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
        // it('isReplace && count == oldCount', async () => {
        //     const mockEnumFactory = new Mock<IEnumFactory>();
        //     const self = new Self(
        //         mockEnumFactory.actual,
        //     );

        //     const mockValueService = new Mock<ValueService>();
        //     mockValueService.expectReturn(
        //         r => r.getCount(null, 2),
        //         1
        //     );

        //     const mockEnum = new Mock<IEnum<ValueTypeData>>({
        //         allItem: {
        //             2: {
        //                 isReplace: true
        //             } as ValueTypeData
        //         }
        //     });
        //     mockEnumFactory.expectReturn(
        //         r => r.build('ValueTypeData'),
        //         mockEnum.actual
        //     );

        //     const mockHandler = new Mock<ValueHandlerBase>();
        //     self.setNext(mockHandler.actual);

        //     await self.handle(
        //         {
        //             uow: null,
        //             value: {
        //                 count: 1,
        //                 valueType: 2
        //             },
        //             valueService: mockValueService.actual
        //         }
        //     );
        // });

        // it('count == 0', async () => {
        //     const mockEnumFactory = new Mock<IEnumFactory>();
        //     const self = new Self(
        //         mockEnumFactory.actual,
        //     );

        //     const mockValueService = new Mock<ValueService>();
        //     mockValueService.expectReturn(
        //         r => r.getCount(null, 2),
        //         11
        //     );

        //     const mockEnum = new Mock<IEnum<ValueTypeData>>({
        //         allItem: {}
        //     });
        //     mockEnumFactory.expectReturn(
        //         r => r.build('ValueTypeData'),
        //         mockEnum.actual
        //     );

        //     const mockHandler = new Mock<ValueHandlerBase>();
        //     self.setNext(mockHandler.actual);

        //     await self.handle(
        //         {
        //             uow: null,
        //             value: {
        //                 count: 0,
        //                 valueType: 2
        //             },
        //             valueService: mockValueService.actual
        //         }
        //     );
        // });
    });
});