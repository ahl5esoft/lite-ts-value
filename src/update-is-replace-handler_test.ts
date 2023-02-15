import { deepStrictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { IEnum, IEnumFactory } from './i-enum-factory';
import { UpdateIsReplaceHandler as Self } from './update-is-replace-handler';
import { ValueHandlerBase } from './value-handler-base';
import { ValueTypeData } from './value-type-data';

describe('src/update-is-replace-handler.ts', () => {
    describe('.handle(value: IValue)', () => {
        it('ok', async () => {
            const mockEnumFactory = new Mock<IEnumFactory>();
            const self = new Self(
                mockEnumFactory.actual,
                null
            );

            const mockEnum = new Mock<IEnum<ValueTypeData>>({
                allItem: {}
            });
            mockEnumFactory.expectReturn(
                r => r.build('ValueTypeData'),
                mockEnum.actual
            );

            const mockHandler = new Mock<ValueHandlerBase>();
            self.setNext(mockHandler.actual);

            mockHandler.expected.handle({
                count: 1,
                valueType: 2
            });

            await self.handle({
                count: 1,
                valueType: 2
            });
        });

        it('isReplace', async () => {
            const mockEnumFactory = new Mock<IEnumFactory>();
            const res = {
                2: 11
            };
            const self = new Self(
                mockEnumFactory.actual,
                Promise.resolve(res),
            );

            const mockEnum = new Mock<IEnum<ValueTypeData>>({
                allItem: {
                    2: {
                        isReplace: true
                    } as ValueTypeData
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build('ValueTypeData'),
                mockEnum.actual
            );

            await self.handle({
                count: 1,
                valueType: 2
            });
            deepStrictEqual(res, {
                2: 0,
            });
        });
    });
});