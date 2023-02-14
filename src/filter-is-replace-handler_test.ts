import { Mock } from 'lite-ts-mock';

import { FilterIsReplaceHandler as Self } from './filter-is-replace-handler';
import { IEnum, IEnumFactory } from './i-enum-factory';
import { ValueHandelrBase } from './value-hanlder-base';
import { ValueTypeData } from './value-type-data';

describe('src/filter-is-replace-handler.ts', () => {
    describe('.handle(value: IValue)', () => {
        it('ok', async () => {
            const mockEnumFactory = new Mock<IEnumFactory>();
            const self = new Self(
                mockEnumFactory.actual,
                Promise.resolve(null),
            );

            const mockEnum = new Mock<IEnum<ValueTypeData>>({
                allItem: {}
            });
            mockEnumFactory.expectReturn(
                r => r.build('ValueTypeData'),
                mockEnum.actual
            );

            const mockHandler = new Mock<ValueHandelrBase>();
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

        it('isReplace && count == oldCount', async () => {
            const mockEnumFactory = new Mock<IEnumFactory>();
            const self = new Self(
                mockEnumFactory.actual,
                Promise.resolve({
                    2: 1
                })
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

            const mockHandler = new Mock<ValueHandelrBase>();
            self.setNext(mockHandler.actual);

            await self.handle({
                count: 1,
                valueType: 2
            });
        });

        it('count == 0', async () => {
            const mockEnumFactory = new Mock<IEnumFactory>();
            const self = new Self(
                mockEnumFactory.actual,
                Promise.resolve({
                    2: 1
                })
            );

            const mockEnum = new Mock<IEnum<ValueTypeData>>({
                allItem: {}
            });
            mockEnumFactory.expectReturn(
                r => r.build('ValueTypeData'),
                mockEnum.actual
            );

            const mockHandler = new Mock<ValueHandelrBase>();
            self.setNext(mockHandler.actual);

            await self.handle({
                count: 0,
                valueType: 2
            });
        });
    });
});