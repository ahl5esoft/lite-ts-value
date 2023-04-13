import { Enum, EnumFactoryBase } from 'lite-ts-enum';
import { Mock } from 'lite-ts-mock';

import { UpdateUpgradeValueHandler as Self } from './update-upgrade-handler';
import { RewardService } from './reward-service';
import { ValueTypeData } from './value-type-data';
import { ValueTypeUpgrade } from './value-type-upgrade';
import { UpgradeData } from './upgrade-data';
import { ValueService } from './value-service';

describe('src/service/value/update-upgrade-handler.ts', () => {
    describe('.handle(option: ValueHandlerOption)', () => {
        it('ok', async () => {
            const enumFactoryMock = new Mock<EnumFactoryBase>();
            const rewardServiceMock = new Mock<RewardService>();
            const self = new Self(enumFactoryMock.actual, rewardServiceMock.actual);

            const valueTypeEnumMock = new Mock<Enum<ValueTypeData>>();
            enumFactoryMock.expectReturn(
                r => r.build(ValueTypeData.name, 0),
                valueTypeEnumMock.actual
            );
            valueTypeEnumMock.expectReturn(
                r => r.getReduce(ValueTypeUpgrade.name),
                {
                    1: 2
                }
            );

            const upgradeEnumMock = new Mock<Enum<UpgradeData>>({
                allItem: {
                    2: {
                        list: [
                            null,
                            {
                                condition: [],
                                rewards: [],
                                consumeValues: [
                                    {
                                        count: 1,
                                        valueType: 10
                                    }
                                ]
                            }
                        ]
                    }
                }
            });
            enumFactoryMock.expectReturn(
                r => r.build(UpgradeData.name, 0),
                upgradeEnumMock.actual
            );

            const valueServiceMock = new Mock<ValueService>();
            valueServiceMock.expectReturn(
                r => r.getCount(null, 2),
                2
            );
            valueServiceMock.expectReturn(
                r => r.checkConditions(null, []),
                true
            );

            rewardServiceMock.expectReturn(
                r => r.findResults(null, [], 's'),
                [
                    {
                        count: 1,
                        valueType: 11
                    }
                ]
            );

            valueServiceMock.expected.update(null, [
                {
                    count: 1,
                    valueType: 11,
                    source: 's'
                },
                {
                    count: 1,
                    valueType: 10,
                    source: 's'
                }
            ]);

            await self.handle({
                areaNo: 0,
                uow: null,
                value: {
                    count: 10,
                    valueType: 1,
                    source: 's'
                },
                valueService: valueServiceMock.actual
            });
        });
    });
});