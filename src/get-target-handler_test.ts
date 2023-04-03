import { strictEqual } from 'assert';
import { Mock, mockAny } from 'lite-ts-mock';

import { GetTargetValueHandler as Self } from './get-target-handler';
import { TargetType } from './target-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { ValueService } from './value-service';

describe('src/get-target-handler.ts', () => {
    describe('.handleDiff(option: ValueHandlerOption, targetType: TargetType)', () => {
        it('ok', async () => {
            const self = new Self(
                null,
                async () => 100,
                null,
                ''
            );

            const fn = Reflect.get(self, 'handleDiff').bind(self) as (arg: ValueHandlerOption, arg1: TargetType) => Promise<void>;
            const mockValueService = new Mock<ValueService>();
            mockValueService.expectReturn(
                r => r.getCount(mockAny, mockAny),
                10
            );
            const res = {
                value: {
                    count: 1,
                    valueType: 2
                },
                valueService: mockValueService.actual
            };
            await fn(res, { valueType: 1 } as any);
            strictEqual(res.value.count, 0);
        });
    });
});