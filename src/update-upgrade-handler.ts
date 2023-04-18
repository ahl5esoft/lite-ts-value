import { EnumFactoryBase } from 'lite-ts-enum';

import { RewardService } from './reward-service';
import { UpgradeData } from './upgrade-data';
import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerContext } from './value-handler-context';
import { ValueTypeData } from './value-type-data';
import { ValueTypeUpgrade } from './value-type-upgrade';

/**
 * 升级数值处理器
 */
export class UpdateUpgradeValueHandler extends ValueHandlerBase {
    public constructor(
        private m_EnumFactory: EnumFactoryBase,
        private m_RewardService: RewardService,
    ) {
        super();
    }

    public async handle(option: ValueHandlerContext) {
        const valueTypeUpgrade = await this.m_EnumFactory.build<ValueTypeData>(ValueTypeData.ctor, option.areaNo).getReduce<ValueTypeUpgrade>(ValueTypeUpgrade.name);
        const levelValueType = valueTypeUpgrade[option.value.valueType];
        if (levelValueType && option.value.count > 0) {
            const level = await option.valueService.getCount(option.uow, levelValueType);
            const upgradeDataAllItem = await this.m_EnumFactory.build<UpgradeData>(UpgradeData.ctor, option.areaNo).allItem;
            if (upgradeDataAllItem[levelValueType]?.list?.[level]) {
                const ok = await option.valueService.checkConditions(option.uow, upgradeDataAllItem[levelValueType].list[level].condition);
                if (ok) {
                    const values = await this.m_RewardService.findResults(
                        option.uow,
                        upgradeDataAllItem[levelValueType].list[level].rewards,
                        option.value.source
                    );
                    await ctx.valueService.update(
                        ctx.uow,
                        [
                            ...values,
                            ...upgradeDataAllItem[levelValueType].list[level].consumeValues
                        ].map(r => {
                            return {
                                ...r,
                                source: ctx.value.source
                            };
                        })
                    );
                }
            }
        }

        await this.next?.handle?.(ctx);
    }
}
