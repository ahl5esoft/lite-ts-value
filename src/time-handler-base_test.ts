import { notStrictEqual, strictEqual } from 'assert';
import moment from 'moment';

import { IValue } from './i-value';
import { TimeHandlerBase } from './time-handler-base';

class Self extends TimeHandlerBase {
    public callHandleDiffArg: IValue;

    protected async handleDiff(value: IValue) {
        this.callHandleDiffArg = value;
    }
}

describe('src/time-handler-base.ts', () => {
    describe('.handle(res: IValue)', () => {
        it('无valueTypeTime', async () => {
            const self = new Self(
                Promise.resolve(null),
                null,
                null,
            );

            const res = {
                count: 1,
                valueType: 2,
            };
            await self.handle(res);
            notStrictEqual(self.callHandleDiffArg, res);
        });

        it('diff', async () => {
            const self = new Self(
                Promise.resolve({
                    valueType: 3,
                    momentType: 'day'
                }),
                Promise.resolve(
                    moment().unix(),
                ),
                Promise.resolve({}),
            );

            const res = {
                count: 1,
                valueType: 2,
            };
            await self.handle(res);
            strictEqual(res, self.callHandleDiffArg);
        });

        it('same', async () => {
            const self = new Self(
                Promise.resolve({
                    valueType: 3,
                    momentType: 'day'
                }),
                Promise.resolve(
                    moment().unix(),
                ),
                Promise.resolve({
                    3: moment().unix(),
                }),
            );

            const res = {
                count: 1,
                valueType: 2,
            };
            await self.handle(res);
            notStrictEqual(self.callHandleDiffArg, res);
        });
    });
});