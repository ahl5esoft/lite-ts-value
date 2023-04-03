import { Mock, mockAny } from 'lite-ts-mock';
import { RpcBase } from 'lite-ts-rpc';

import { TargetType } from './target-handler-base';
import { UpdateTargetValueHandler as Self } from './update-target-handler';
import { Value } from './value';
import { ValueService } from './value-service';
import { deepStrictEqual } from 'assert';

describe('src/update-target-handler.ts', () => {
    describe('.handleDiff(value: Value, valueService: ValueService, areaNo: number, targetType: TargetType)', () => {
        it('ok', async () => {
            const mockRpc = new Mock<RpcBase>();
            mockRpc.expectReturn(
                r => r.callWithoutThrow(mockAny),
                {
                    data: 100
                }
            );
            const self = new Self(
                null,
                null,
                mockRpc.actual,
                ''
            );
            const fn = Reflect.get(self, 'handleDiff').bind(self) as (value: Value, valueService: ValueService, areaNo: number, targetType: TargetType) => Promise<void>;
            const ownValue = {
                1: 1,
                2: 1
            };
            const mockValueService = new Mock<ValueService>({
                ownValue
            });
            await fn(
                {
                    count: 1,
                    valueType: 1
                },
                mockValueService.actual,
                0,
                {
                    app: '',
                    ext: '',
                    valueType: 2
                }
            );

            deepStrictEqual(ownValue, {
                1: 0,
                2: 100
            })
        });
    });
});