import { deepStrictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { UpdateReplacerHandler as Self } from './update-replacer-handler';
import { ValueHandelrBase } from './value-hanlder-base';

describe('src/replacer-handler.ts', () => {
    describe('.handle(value: IValue)', () => {
        it('ok', async () => {
            const self = new Self(
                Promise.resolve(null),
                null
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

        it('isReplace', async () => {
            const res = {
                2: 11
            };
            const self = new Self(
                Promise.resolve({
                    isReplace: true
                }),
                Promise.resolve(res),
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