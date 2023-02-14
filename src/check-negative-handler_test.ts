import { deepStrictEqual, notStrictEqual, strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { CheckNegativeHandler as Self, CustomError } from './check-negative-handler';
import { IEnum, IEnumFactory } from './i-enum-factory';
import { ValueHandelrBase } from './value-hanlder-base';
import { ValueTypeData } from './value-type-data';

describe('src/check-negative-handler.ts', () => {
    describe('.handle(value: IValue)', () => {
        it('ok', async () => {
            const mockEnumFactory = new Mock<IEnumFactory>();
            const self = new Self(
                mockEnumFactory.actual,
                Promise.resolve({
                    3: -1
                }),
            );

            const mockEnum = new Mock<IEnum<ValueTypeData>>({
                allItem: {
                    3: {
                        isNegative: true
                    } as ValueTypeData
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build('ValueTypeData'),
                mockEnum.actual
            );

            const mockNext = new Mock<ValueHandelrBase>();
            self.setNext(mockNext.actual);

            mockNext.expected.handle({
                count: -2,
                valueType: 3
            });

            await self.handle({
                count: -2,
                valueType: 3
            });
        });

        it('error', async () => {
            const mockEnumFactory = new Mock<IEnumFactory>();
            const self = new Self(
                mockEnumFactory.actual,
                Promise.resolve({
                    3: -1
                }),
            );

            const mockEnum = new Mock<IEnum<ValueTypeData>>({
                allItem: {}
            });
            mockEnumFactory.expectReturn(
                r => r.build('ValueTypeData'),
                mockEnum.actual
            );

            let err: Error;
            try {
                await self.handle({
                    count: -2,
                    valueType: 3
                });
            } catch (ex) {
                err = ex;
            }
            notStrictEqual(err, undefined);
            const cErr = err as CustomError;
            strictEqual(cErr.code, Self.notEnoughErrorCode);
            deepStrictEqual(cErr.data, {
                consume: 2,
                count: 1,
                valueType: 3
            });
        });
    });
});