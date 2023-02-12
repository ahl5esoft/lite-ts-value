import { deepStrictEqual, strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { ValueHandelrBase } from './value-hanlder-base';
import { INowTime, RelationOperator, ValueService } from './value-service';

class Self extends ValueService {
    public constructor(
        private m_GetCountFunc: (valueType: number) => Promise<number>,
        nowTime: INowTime,
        getCountHander: ValueHandelrBase,
    ) {
        super(
            nowTime,
            Promise.resolve({}),
            getCountHander,
            null,
            (consume, count, valueType) => {
                return [consume, count, valueType] as any;
            }
        );
    }

    public async getCount(valueType: number) {
        return this.m_GetCountFunc(valueType);
    }

    public async update() { }
}

describe('src/value-service-base.ts', () => {
    describe('.checkConditions(conditions: contract.IValueCondition[])', () => {
        it(`${RelationOperator.eq}(单组)`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 11;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([
                [{
                    count: 11,
                    op: RelationOperator.eq,
                    valueType: 1
                }]
            ]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.eq}(单组)不通过`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 1;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([
                [{
                    count: 11,
                    op: RelationOperator.eq,
                    valueType: 1
                }]
            ]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.nowDiff}${RelationOperator.eq}(单组)`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 9;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 1,
                op: (RelationOperator.eq + RelationOperator.nowDiff) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.nowDiff}${RelationOperator.eq}(单组)不通过`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 10;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 1,
                op: (RelationOperator.eq + RelationOperator.nowDiff) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.ge}(单组)`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 11;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 11,
                op: RelationOperator.ge,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.ge}(单组)不通过`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 10;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 11,
                op: RelationOperator.ge,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.nowDiff}${RelationOperator.ge}(单组)`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 9;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 1,
                op: (RelationOperator.nowDiff + RelationOperator.ge) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.nowDiff}${RelationOperator.ge}(单组)不通过`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 10;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 1,
                op: (RelationOperator.nowDiff + RelationOperator.ge) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.gt}(单组)`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 12;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 11,
                op: RelationOperator.gt,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.gt}(单组)不通过`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 11;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 11,
                op: RelationOperator.gt,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.nowDiff}${RelationOperator.gt}(单组)`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 8;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 1,
                op: (RelationOperator.nowDiff + RelationOperator.gt) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.nowDiff}${RelationOperator.gt}(单组)不通过`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 11;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 1,
                op: (RelationOperator.nowDiff + RelationOperator.gt) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.le}(单组)`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 11;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 11,
                op: RelationOperator.le,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.le}(单组)不通过`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 12;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 11,
                op: RelationOperator.le,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.nowDiff}${RelationOperator.lt}(单组)`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 9;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 1,
                op: (RelationOperator.nowDiff + RelationOperator.le) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.nowDiff}${RelationOperator.le}(单组)不通过`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 8;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 1,
                op: (RelationOperator.nowDiff + RelationOperator.le) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.lt}(单组)`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 10;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 11,
                op: RelationOperator.lt,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.lt}(单组)不通过`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 11;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 11,
                op: RelationOperator.lt,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.nowDiff}${RelationOperator.lt}(单组)`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 10;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 1,
                op: (RelationOperator.nowDiff + RelationOperator.lt) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.nowDiff}${RelationOperator.lt}(单组)不通过`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 8;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 1,
                op: (RelationOperator.nowDiff + RelationOperator.lt) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.mod}${RelationOperator.eq}(单组)`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 11;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 201,
                op: (RelationOperator.mod + RelationOperator.eq) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.mod}${RelationOperator.eq}(单组)不通过`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 10;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 201,
                op: (RelationOperator.mod + RelationOperator.eq) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.mod}${RelationOperator.ge}(单组)`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 11;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 200,
                op: (RelationOperator.mod + RelationOperator.ge) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.mod}${RelationOperator.ge}(单组)不通过`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 3;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 301,
                op: (RelationOperator.mod + RelationOperator.ge) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.mod}${RelationOperator.gt}(单组)`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 11;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 200,
                op: (RelationOperator.mod + RelationOperator.gt) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.mod}${RelationOperator.gt}(单组)不通过`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 3;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 301,
                op: (RelationOperator.mod + RelationOperator.gt) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.mod}${RelationOperator.le}(单组)`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 11;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 201,
                op: (RelationOperator.mod + RelationOperator.le) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.mod}${RelationOperator.le}(单组)不通过`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 2;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 301,
                op: (RelationOperator.mod + RelationOperator.le) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.mod}${RelationOperator.lt}(单组)`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 10;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 201,
                op: (RelationOperator.mod + RelationOperator.lt) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.mod}${RelationOperator.lt}(单组)不通过`, async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async () => {
                return 2;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 301,
                op: (RelationOperator.mod + RelationOperator.lt) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it('all(单组)', async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async (valueType: number) => {
                return {
                    1: 11,
                    2: 22,
                    3: 33
                }[valueType];
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 11,
                op: RelationOperator.eq,
                valueType: 1
            }, {
                count: 20,
                op: RelationOperator.gt,
                valueType: 2
            }, {
                count: 35,
                op: RelationOperator.lt,
                valueType: 3
            }]]);
            strictEqual(res, true);
        });

        it('some(单组)', async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async (valueType: number) => {
                return {
                    1: 11,
                    2: 22,
                    3: 33
                }[valueType];
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([[{
                count: 9,
                op: RelationOperator.eq,
                valueType: 1
            }, {
                count: 20,
                op: RelationOperator.gt,
                valueType: 2
            }, {
                count: 35,
                op: RelationOperator.lt,
                valueType: 3
            }]]);
            strictEqual(res, false);
        });

        it('多组', async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async (valueType: number) => {
                return {
                    1: 11,
                    2: 22,
                    3: 33
                }[valueType];
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            const res = await self.checkConditions([
                [{
                    count: 11,
                    op: RelationOperator.eq,
                    valueType: 1
                }, {
                    count: 20,
                    op: RelationOperator.gt,
                    valueType: 2
                }, {
                    count: 35,
                    op: RelationOperator.lt,
                    valueType: 3
                }],
                [{
                    count: 9,
                    op: RelationOperator.eq,
                    valueType: 1
                }, {
                    count: 20,
                    op: RelationOperator.gt,
                    valueType: 2
                }, {
                    count: 35,
                    op: RelationOperator.lt,
                    valueType: 3
                }]
            ]);
            strictEqual(res, true);
        });
    });

    describe('.checkEnough(uow: IUnitOfWork, times: number, consumeValues: model.contract.IValue[])', () => {
        it('ok', async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async (arg: number) => {
                strictEqual(arg, 2);
                return 99;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            let err: Error;
            try {
                await self.checkEnough(2, [{
                    count: -1,
                    valueType: 2
                }]);
            } catch (ex) {
                err = ex;
            }
            strictEqual(err, undefined);
        });

        it('false', async () => {
            const mockNowTime = new Mock<INowTime>();
            const self = new Self(async (arg: number) => {
                strictEqual(arg, 2);
                return 0;
            }, mockNowTime.actual, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            let err: Error;
            try {
                await self.checkEnough(2, [{
                    count: -1,
                    valueType: 2
                }]);
            } catch (ex) {
                err = ex;
            }
            deepStrictEqual(err, [2, 0, 2]);
        });
    });

    describe('.getCount(valueType: number)', () => {
        it('ok', async () => {
            const mockValueHandler = new Mock<ValueHandelrBase>();
            const self = new ValueService(
                null,
                Promise.resolve({
                    1: 11
                }),
                mockValueHandler.actual,
                null,
                null,
            );

            mockValueHandler.expected.handle({
                count: 11,
                valueType: 1
            });

            const res = await self.getCount(1);
            strictEqual(res, 11);
        });
    });
});