import { Enum, EnumFactoryBase } from 'lite-ts-enum';
import { Mock, mockAny } from 'lite-ts-mock';

import { UpdateExpireTimeValueHandler as Self } from './update-expire-time-handler';

describe('src/update-expire-time-handler.ts', () => {
    describe('.handle(option: ValueHandlerOption)', () => {
        it('ok', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(
                mockEnumFactory.actual,
                async () => { },
                async () => 1
            );

            const mockEnum = new Mock<Enum<any>>({
                allItem: {
                    1: {
                        time: {
                            expireOn: 30,
                        }
                    }
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build(mockAny, 0),
                mockEnum.actual
            );

            const option = {
                areaNo: 0,
                value: {
                    count: 1,
                    valueType: 1
                }
            } as any;
            await self.handle(option);
        });
    });
});