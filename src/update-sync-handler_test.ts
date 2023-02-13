import { Mock } from 'lite-ts-mock';

import { IValueService } from './i-value-service';
import { UpdateSyncHandler as Self } from './update-sync-handler';

describe('src/update-sync-handler.ts', () => {
    describe('.handle(value: IValue)', () => {
        it('ok', async () => {
            const mockValueService = new Mock<IValueService>();
            const self = new Self(
                mockValueService.actual,
                Promise.resolve({
                    valueTypes: [3, 4]
                })
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