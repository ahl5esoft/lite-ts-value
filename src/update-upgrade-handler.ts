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

    public async handle(ctx: ValueHandlerContext) {
        const valueTypeUpgrade = await this.m_EnumFactory.build({
            app: 'config',
            areaNo: ctx.areaNo,
            ctor: ValueTypeData,
        }).getReduce<ValueTypeUpgrade>(ValueTypeUpgrade.name);
        const levelValueType = valueTypeUpgrade[ctx.value.valueType];
        if (levelValueType && ctx.value.count > 0) {
            const level = await ctx.valueService.getCount(ctx.uow, levelValueType);
            const upgradeDataAllItem = await this.m_EnumFactory.build({
                app: 'config',
                areaNo: ctx.areaNo,
                ctor: UpgradeData,
            }).allItem;
            if (upgradeDataAllItem[levelValueType]?.list?.[level]) {
                const ok = await ctx.valueService.checkConditions(ctx.uow, upgradeDataAllItem[levelValueType].list[level].condition);
                if (ok) {
                    const values = await this.m_RewardService.findResults(
                        ctx.uow,
                        upgradeDataAllItem[levelValueType].list[level].rewards,
                        ctx.value.source
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
