import { deepStrictEqual, strictEqual } from 'assert';
import { IRandSeedService, IUnitOfWork } from 'lite-ts-db';
import { Mock } from 'lite-ts-mock';
import { Enum, EnumFactoryBase } from 'lite-ts-enum';

import { Reward } from './reward';
import { RewardService as Self } from './reward-service';
import { ValueService } from './value-service';
import { ValueTypeData } from './value-type-data';
import { ValueTypeRewardAddition } from './value-type-reward-addition';
import { ValueTypeRewardOpen } from './value-type-reward-open';

describe('src/reward-service.ts', () => {
    describe('.findResults(uow: IUnitOfWork, rewards: Reward[][], source?: string)', () => {
        it('固定', async () => {
            const self = new Self(null, null, null);

            Reflect.set(self, 'findOpenRewards', (_: IUnitOfWork, arg: number) => {
                return arg == 1 ? [
                    [{
                        count: 3,
                        valueType: 4,
                    }]
                ] : null;
            });

            const res = await self.findResults(null, [
                [{
                    count: 2,
                    valueType: 1
                }]
            ], 'test');
            deepStrictEqual(res, [{
                count: 6,
                source: 'test',
                targetNo: undefined,
                targetType: undefined,
                valueType: 4,
            }]);
        });

        it('权重', async () => {
            const mockRandSeedService = new Mock<IRandSeedService>();
            const self = new Self(mockRandSeedService.actual, null, null);

            Reflect.set(self, 'findOpenRewards', () => {
                return null;
            });

            mockRandSeedService.expectReturn(
                r => r.use(null, 1),
                2
            );

            mockRandSeedService.expectReturn(
                r => r.use(null, 1),
                1
            );

            mockRandSeedService.expectReturn(
                r => r.use(null, 2),
                11
            );

            const res = await self.findResults(null, [
                [{
                    count: 2,
                    source: 't2',
                    valueType: 1,
                    weight: 10
                }, {
                    count: 2,
                    source: 't2',
                    valueType: 3,
                    weight: 11
                }]
            ], 'test');
            deepStrictEqual(res, [{
                count: 2,
                source: 't2',
                targetNo: undefined,
                targetType: undefined,
                valueType: 1,
            }]);
        });
    });

    describe('.preview(uow: IUnitOfWork, rewards: Reward[][], offset?: number)', () => {
        it('ok', async () => {
            const mockRandSeedService = new Mock<IRandSeedService>();
            const self = new Self(mockRandSeedService.actual, null, null);

            Reflect.set(self, 'findOpenRewards', (_: IUnitOfWork, arg: number) => {
                return arg == 1 ? [
                    [{
                        count: 4,
                        valueType: 3,
                        weight: 1
                    }, {
                        count: 6,
                        valueType: 5,
                        weight: 1
                    }]
                ] : null;
            });

            mockRandSeedService.expectReturn(
                r => r.get(null, 1, 0),
                2
            );

            mockRandSeedService.expectReturn(
                r => r.get(null, 1, 1),
                1
            );

            mockRandSeedService.expectReturn(
                r => r.get(null, 2, 2),
                11
            );

            mockRandSeedService.expectReturn(
                r => r.get(null, 1, 4),
                2
            );

            mockRandSeedService.expectReturn(
                r => r.get(null, 1, 5),
                1
            );

            mockRandSeedService.expectReturn(
                r => r.get(null, 1, 6),
                0
            );

            mockRandSeedService.expectReturn(
                r => r.get(null, 1, 7),
                2
            );

            mockRandSeedService.expectReturn(
                r => r.get(null, 1, 8),
                1
            );

            mockRandSeedService.expectReturn(
                r => r.get(null, 1, 9),
                1
            );

            const rewards = [
                [{
                    count: 10,
                    source: 't2',
                    valueType: 1,
                    weight: 1
                }, {
                    count: 2,
                    source: 't2',
                    valueType: 1,
                    weight: 9
                }]
            ];
            const res = await self.preview(null, rewards);
            deepStrictEqual(res, {
                offset: 0,
                values: [{
                    count: 4,
                    valueType: 3
                }, {
                    count: 6,
                    valueType: 5
                }]
            });
            strictEqual(rewards.length, 1);
        });
    });

    describe('.findOpenRewards(uow: IUnitOfWork, valueType: number)', () => {
        it('ok', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const mockValueService = new Mock<ValueService>();
            const self = new Self(null, mockEnumFactory.actual, mockValueService.actual);

            const mockEnum = new Mock<Enum<ValueTypeData>>();
            mockEnumFactory.expectReturn(
                r => r.build({
                    app: 'config',
                    areaNo: undefined,
                    ctor: ValueTypeData
                }),
                mockEnum.actual
            );

            mockEnum.expectReturn(
                r => r.getReduce(ValueTypeRewardOpen.ctor),
                {
                    1: [
                        [{
                            count: 2,
                            weight: 10,
                            valueType: 3
                        }, {
                            count: 4,
                            weight: 20,
                            valueType: 5
                        }]
                    ] as Reward[][]
                }
            );

            mockEnum.expectReturn(
                r => r.getReduce(ValueTypeRewardAddition.ctor),
                {
                    1: {
                        3: 6
                    }
                } as {
                    [valueType: number]: {
                        [rewardValueType: number]: number;
                    };
                }
            );

            mockValueService.expectReturn(
                r => r.getCount(null, 6),
                90
            );

            const fn = Reflect.get(self, 'findOpenRewards').bind(self) as (_: IUnitOfWork, __: number) => Promise<Reward[][]>;
            const res = await fn(null, 1);
            deepStrictEqual(res, [
                [{
                    count: 2,
                    weight: 100,
                    valueType: 3
                }, {
                    count: 4,
                    weight: 20,
                    valueType: 5
                }]
            ]);
        });
    });
});