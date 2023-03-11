import { IRandSeedService, IUnitOfWork } from 'lite-ts-db';
import { EnumFactoryBase } from 'lite-ts-enum';

import { Reward } from './reward';
import { Value } from './value';
import { ValueService } from './value-service';
import { ValueTypeData } from './value-type-data';
import { ValueTypeRewardAddition } from './value-type-reward-addition';
import { ValueTypeRewardOpen } from './value-type-reward-open';

export class RewardService {
    public constructor(
        private m_RandSeedService: IRandSeedService,
        private m_EnummFactory: EnumFactoryBase,
        private m_ValueService: ValueService,
    ) { }

    public async findResults(uow: IUnitOfWork, rewards: Reward[][], source?: string) {
        const res: { [valueType: number]: Value; } = {};
        for (const r of rewards) {
            if (!r?.length)
                continue;

            let reward: Reward;
            if (r.length == 1) {
                reward = r[0];
            } else {
                let total = 0;
                const unsortItems: {
                    reward: Reward;
                    rand: number;
                }[] = [];
                for (const cr of r) {
                    total += cr.weight * 1;
                    unsortItems.push({
                        rand: await this.m_RandSeedService.use(uow, 1),
                        reward: cr,
                    });
                }
                const seed = await this.m_RandSeedService.use(
                    uow,
                    total.toString().length
                );
                let rand = seed % total + 1;
                reward = unsortItems.sort((a, b) => {
                    return a.rand - b.rand;
                }).find(cr => {
                    rand -= cr.reward.weight;
                    return rand <= 0;
                }).reward;
            }

            const openRewards = await this.findOpenRewards(uow, reward.valueType);
            if (openRewards) {
                for (let i = 0; i < reward.count; i++) {
                    const resValues = await this.findResults(uow, openRewards, source);
                    for (const item of resValues) {
                        res[item.valueType] ??= {
                            count: 0,
                            source: item.source ?? source,
                            targetNo: item.targetNo,
                            targetType: item.targetType,
                            valueType: item.valueType,
                        };
                        res[item.valueType].count += item.count;
                    }
                }
            } else {
                res[reward.valueType] ??= {
                    count: 0,
                    source: reward.source ?? source,
                    targetNo: reward.targetNo,
                    targetType: reward.targetType,
                    valueType: reward.valueType,
                };
                res[reward.valueType].count += reward.count;
            }
        }

        return Object.values(res);
    }

    public async preview(uow: IUnitOfWork, rewards: Reward[][], offset?: number) {
        offset ??= 0;
        const res: {
            offset: number,
            value: { [valueType: number]: Value; },
        } = {
            offset: 0,
            value: {},
        };
        let rewardsQueue = [...rewards];
        while (rewardsQueue.length) {
            const childRewards = rewardsQueue.shift();
            if (!childRewards?.length)
                continue;

            let reward: Reward;
            if (childRewards.length == 1) {
                reward = childRewards[0];
            } else {
                let total = 0;
                const unsortItems: {
                    reward: Reward;
                    rand: number;
                }[] = [];
                for (const r of childRewards) {
                    total += r.weight * 1;
                    unsortItems.push({
                        rand: await this.m_RandSeedService.get(uow, 1, offset++),
                        reward: r,
                    });
                }
                const len = total.toString().length;
                const seed = await this.m_RandSeedService.get(uow, len, offset);
                offset += len;
                let rand = seed % total + 1;
                reward = unsortItems.sort((a, b) => {
                    return a.rand - b.rand;
                }).find(r => {
                    rand -= r.reward.weight;
                    return rand <= 0;
                }).reward;
            }

            const openRewards = await this.findOpenRewards(uow, reward.valueType);
            if (openRewards) {
                for (let i = 0; i < reward.count; i++)
                    rewardsQueue.splice(openRewards.length * i, 0, ...openRewards);
            } else {
                res.value[reward.valueType] ??= {
                    count: 0,
                    valueType: reward.valueType,
                };
                res.value[reward.valueType].count += reward.count;
            }
        }

        return {
            offset: res.offset,
            values: Object.values(res.value),
        };
    }

    private async findOpenRewards(uow: IUnitOfWork, valueType: number) {
        const valueTypeEnum = this.m_EnummFactory.build(ValueTypeData);
        const openReward = await valueTypeEnum.getReduce<ValueTypeRewardOpen>(ValueTypeRewardOpen.ctor);
        if (!openReward[valueType])
            return;

        const rewardAddition = await valueTypeEnum.getReduce<ValueTypeRewardAddition>(ValueTypeRewardAddition.ctor);
        if (!rewardAddition[valueType])
            return openReward[valueType];

        const res: Reward[][] = [];
        for (const r of openReward[valueType]) {
            if (r.length > 1) {
                const children: Reward[] = [];
                for (const cr of r) {
                    let weightAddition = 0;
                    if (rewardAddition[valueType][cr.valueType])
                        weightAddition = await this.m_ValueService.getCount(uow, rewardAddition[valueType][cr.valueType]);
                    children.push({
                        ...cr,
                        weight: cr.weight + weightAddition
                    });
                }
                res.push(children);
            } else {
                res.push(r);
            }
        }
        return res;
    }
}