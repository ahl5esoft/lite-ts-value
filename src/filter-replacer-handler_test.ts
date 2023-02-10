import { Mock } from 'lite-ts-mock';

import { FilterReplacerHandler as Self } from './filter-replacer-handler';
import { ValueHandelrBase } from './value-hanlder-base';

describe('src/filter-replacer-handler.ts', () => {
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

        it('isReplace && count == oldCount', async () => {
            const self = new Self(
                Promise.resolve({
                    isReplace: true
                }),
                Promise.resolve({
                    2: 1
                })
            );

            await self.handle({
                count: 1,
                valueType: 2
            });
        });

        it('count == 0', async () => {
            const self = new Self(
                Promise.resolve(null),
                null
            );

            await self.handle({
                count: 0,
                valueType: 2
            });
        });
    });
});