import { EnumFactoryBase } from 'lite-ts-enum';

import { RewardService } from './reward-service';
import { UpgradeData } from './upgrade-data';
import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerOption } from './value-handler-option';
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

    public async handle(option: ValueHandlerOption) {
        const valueTypeUpgrade = await this.m_EnumFactory.build<ValueTypeData>(ValueTypeData.name, option.areaNo).getReduce<ValueTypeUpgrade>(ValueTypeUpgrade.name);
        const levelValueType = valueTypeUpgrade[option.value.valueType];
        if (levelValueType && option.value.count > 0) {
            const level = await option.valueService.getCount(option.uow, levelValueType);
            const upgradeDataAllItem = await this.m_EnumFactory.build<UpgradeData>(UpgradeData.name, option.areaNo).allItem;
            if (upgradeDataAllItem[levelValueType]?.list?.[level - 1]) {
                const ok = await option.valueService.checkConditions(option.uow, upgradeDataAllItem[levelValueType].list[level - 1].condition);
                if (ok) {
                    const values = await this.m_RewardService.findResults(
                        option.uow,
                        upgradeDataAllItem[levelValueType].list[level - 1].rewards,
                        option.value.source
                    );
                    await option.valueService.update(
                        option.uow,
                        [
                            ...values,
                            ...upgradeDataAllItem[levelValueType].list[level - 1].consumeValues
                        ].map(r => {
                            return {
                                ...r,
                                source: option.value.source
                            };
                        })
                    );
                }
            }
        }

        await this.next?.handle?.(option);
    }
}
