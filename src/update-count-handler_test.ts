import { deepStrictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { UpdateCountValueHandler as Self } from './update-count-handler';
import { ValueService } from './value-service';

describe('src/update-count-handler.ts', () => {
    describe('.handle(ctx: ValueHandlerContext)', () => {
        it('ok', async () => {
            const res = {};
            const self = new Self();

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
                2: 1
            });
        });
    });
});