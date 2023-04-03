import { deepStrictEqual } from 'assert';
import { Mock, mockAny } from 'lite-ts-mock';
import { RpcBase } from 'lite-ts-rpc';

import { Time } from './expire-time-handler-base';
import { UpdateTargetTimeValueHandler as Self } from './update-target-time-handler';
import { Value } from './value';
import { ValueService } from './value-service';

describe('src/update-target-time-handler.ts', () => {
    describe('.handleDiff(value: Value, valueService: ValueService, time: Time, areaNo: number)', () => {
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
            const fn = Reflect.get(self, 'handleDiff').bind(self) as (value: Value, valueService: ValueService, time: Time, areaNo: number) => Promise<void>;
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
                {
                    expiredOnValueType: 2,
                    targetType: {
                        app: '',
                        ext: ''
                    }
                } as any,
                0,
            );

            deepStrictEqual(ownValue, {
                1: 0,
                2: 100
            });
        });
    });
});