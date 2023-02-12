import { deepStrictEqual, strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { CheckNegativeHandler as Self } from './check-negative-handler';
import { ValueHandelrBase } from './value-hanlder-base';

describe('src/check-negative-handler.ts', () => {
    describe('.handle(value: IValue)', () => {
        it('ok', async () => {
            const self = new Self(
                Promise.resolve({
                    isNegative: true
                }),
                Promise.resolve({
                    3: -1
                }),
                null,
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
            const self = new Self(
                Promise.resolve(null),
                Promise.resolve({
                    3: -1
                }),
                (arg, arg1, arg2) => {
                    strictEqual(arg, -2);
                    strictEqual(arg1, 1);
                    strictEqual(arg2, 3);
                    return [] as any;
                }
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
            deepStrictEqual(err, []);
        });
    });
});