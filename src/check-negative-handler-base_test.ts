import { deepStrictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { CheckNegativeHandlerBase } from './check-negative-handler-base';
import { ValueHandelrBase } from './value-hanlder-base';

class Self extends CheckNegativeHandlerBase {
    protected createNotEnoughError(consume: number, count: number, valueType: number) {
        return [consume, count, valueType] as any;
    }
}

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
            deepStrictEqual(err, [-2, 1, 3]);
        });
    });
});