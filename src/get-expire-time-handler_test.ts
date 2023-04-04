import { strictEqual } from 'assert';

import { GetExpireTimeValueHandler as Self } from './get-expire-time-handler';

describe('src/get-expire-time-handler.ts', () => {
    describe('.handle(option: ValueHandlerOption)', () => {
        it('greater than', async () => {
            const self = new Self(
                async (_: number) => {
                    return {
                        count: 50,
                        expireTime: 1,
                        id: 'string',
                        userID: 'string',
                        valueType: 1
                    };
                },
                async () => 100
            );

            const option = {
                value: {
                    count: 1,
                    valueType: 1
                }
            } as any;
            await self.handle(option);
            strictEqual(option.value.count, 0);
        });

        it('less than', async () => {
            const self = new Self(
                async (_: number) => {
                    return {
                        count: 50,
                        expireTime: 100,
                        id: 'string',
                        userID: 'string',
                        valueType: 1
                    };
                },
                async () => 1
            );

            const option = {
                value: {
                    count: 1,
                    valueType: 1
                }
            } as any;
            await self.handle(option);
            strictEqual(option.value.count, 1);
        });
    });
});