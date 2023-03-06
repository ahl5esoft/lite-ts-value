import { Mock } from 'lite-ts-mock';

import { UpdateAutoRecoveryHandler as Self } from './update-auto-recovery-handler';
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
            const mockHandler = new Mock<ValueHandlerBase>();
            mockHandler.expected.handle(
                {
                    uow: null,
                    value: {
                        count: 15,
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
    });
});