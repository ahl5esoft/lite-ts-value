import { deepStrictEqual } from 'assert';
import { Enum, EnumFactoryBase } from 'lite-ts-enum';
import { Mock } from 'lite-ts-mock';

import { UpdateIsReplaceValueHandler as Self } from './update-is-replace-handler';
import { ValueHandlerBase } from './value-handler-base';
import { ValueService } from './value-service';
import { ValueTypeData } from './value-type-data';

describe('src/update-is-replace-handler.ts', () => {
    describe('.handle(ctx: ValueHandlerContext)', () => {
        it('ok', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(
                mockEnumFactory.actual,
            );

            const mockEnum = new Mock<Enum<ValueTypeData>>({
                allItem: {}
            });
            mockEnumFactory.expectReturn(
                r => r.build('ValueTypeData', undefined),
                mockEnum.actual
            );

            const mockHandler = new Mock<ValueHandlerBase>();
            self.setNext(mockHandler.actual);

            const mockValueService = new Mock<ValueService>({
                ownValue: null
            });
            mockHandler.expected.handle(
                {
                    value: {
                        count: 1,
                        valueType: 2
                    },
                    valueService: mockValueService.actual
                }
            );

            await self.handle(
                {
                    value: {
                        count: 1,
                        valueType: 2
                    },
                    valueService: mockValueService.actual
                }
            );
        });

        it('isReplace', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(
                mockEnumFactory.actual,
            );

            const mockEnum = new Mock<Enum<ValueTypeData>>({
                allItem: {
                    2: {
                        isReplace: true
                    } as ValueTypeData
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build('ValueTypeData', undefined),
                mockEnum.actual
            );

            const res = {
                2: 11
            };
            const mockValueService = new Mock<ValueService>({
                ownValue: res
            });
            await self.handle(
                {
                    value: {
                        count: 1,
                        valueType: 2
                    },
                    valueService: mockValueService.actual
                }
            );
            deepStrictEqual(res, {
                2: 0,
            });
        });
    });
});