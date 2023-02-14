import { Mock } from 'lite-ts-mock';

import { IEnum, IEnumFactory } from './i-enum-factory';
import { UpdateSyncHandler as Self } from './update-sync-handler';
import { ValueServiceBase } from './value-service-base';
import { ValueTypeData } from './value-type-data';

describe('src/update-sync-handler.ts', () => {
    describe('.handle(value: IValue)', () => {
        it('ok', async () => {
            const mockEnumFactory = new Mock<IEnumFactory>();
            const mockValueService = new Mock<ValueServiceBase>();
            const self = new Self(
                mockEnumFactory.actual,
                mockValueService.actual,
            );

            const mockEnum = new Mock<IEnum<ValueTypeData>>({
                allItem: {
                    2: {
                        sync: {
                            valueTypes: [3, 4]
                        }
                    } as ValueTypeData
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build('ValueTypeData'),
                mockEnum.actual
            );

            mockValueService.expected.update([{
                count: 1,
                valueType: 3,
            }, {
                count: 1,
                valueType: 4,
            }])

            await self.handle({
                count: 1,
                valueType: 2
            });
        });
    });
});