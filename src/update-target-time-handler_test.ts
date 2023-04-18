import { deepStrictEqual } from 'assert';
import { EnumFactoryBase } from 'lite-ts-enum';
import { Mock, mockAny } from 'lite-ts-mock';
import { RpcBase } from 'lite-ts-rpc';

import { UpdateTargetTimeValueHandler as Self } from './update-target-time-handler';
import { ValueService } from './value-service';

describe('src/update-target-time-handler.ts', () => {
    describe('.handling(option: ValueHandlerContext, time: Time)', () => {
        it('ok', async () => {
            const mockRpc = new Mock<RpcBase>();
            mockRpc.expectReturn(
                r => r.call(mockAny),
                {
                    data: 1
                }
            );
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(
                async () => 100,
                mockRpc.actual,
                '',
                mockEnumFactory.actual,
            );

            const ownValue = {
                2: 1
            };
            const mockValueService = new Mock<ValueService>({
                ownValue
            });

            const option = {
                areaNo: 0,
                value: {
                    count: 1,
                    valueType: 2
                },
                valueService: mockValueService.actual
            } as any;
            const fn = Reflect.get(self, 'handling').bind(self) as (option: any, time: any) => Promise<void>;
            await fn(
                option,
                {
                    expireOnValueType: 3,
                    targetType: {
                        app: '',
                        ext: ''
                    }
                }
            );
            deepStrictEqual(ownValue, {
                2: 0,
                3: 1
            });
        });

        it('false', async () => {
            const mockRpc = new Mock<RpcBase>();
            mockRpc.expectReturn(
                r => r.call(mockAny),
                {
                    data: 100
                }
            );
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(
                async () => 1,
                mockRpc.actual,
                '',
                mockEnumFactory.actual,
            );

            const ownValue = {
                2: 1,
                3: 20
            };
            const mockValueService = new Mock<ValueService>({
                ownValue
            });

            const option = {
                areaNo: 0,
                value: {
                    count: 1,
                    valueType: 2
                },
                valueService: mockValueService.actual
            } as any;
            const fn = Reflect.get(self, 'handling').bind(self) as (option: any, time: any) => Promise<void>;
            await fn(
                option,
                {
                    expireOnValueType: 3,
                    targetType: {
                        app: '',
                        ext: ''
                    }
                }
            );
            deepStrictEqual(ownValue, {
                2: 1,
                3: 100
            });
        });
    });
});