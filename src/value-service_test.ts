import { strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { ValueHandlerBase } from './value-handler-base';
import { RelationOperator, ValueService } from './value-service';

class Self extends ValueService {
    public getCountHandler: ValueHandlerBase;

    public constructor(
        private m_GetCountFunc: (valueType: number) => Promise<number>,
        now: number,
        ownValue: Promise<{ [valueType: number]: number }>,
    ) {
        super(
            ownValue,
            null,
            null,
            async () => now,
        );
    }

    public async getCount(valueType: number) {
        return this.m_GetCountFunc ? this.m_GetCountFunc(valueType) : super.getCount(valueType);
    }

    public async update() { }
}

describe('src/value-service.ts', () => {
    describe('.checkConditions(conditions: contract.IValueCondition[])', () => {
        it(`${RelationOperator.eq}(单组)`, async () => {
            const self = new Self(async () => {
                return 11;
            }, 10, null);

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
            const self = new Self(async () => {
                return 1;
            }, 10, null);

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
            const self = new Self(async () => {
                return 9;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 1,
                op: (RelationOperator.eq + RelationOperator.nowDiff) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.nowDiff}${RelationOperator.eq}(单组)不通过`, async () => {
            const self = new Self(async () => {
                return 10;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 1,
                op: (RelationOperator.eq + RelationOperator.nowDiff) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.ge}(单组)`, async () => {
            const self = new Self(async () => {
                return 11;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 11,
                op: RelationOperator.ge,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.ge}(单组)不通过`, async () => {
            const self = new Self(async () => {
                return 10;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 11,
                op: RelationOperator.ge,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.nowDiff}${RelationOperator.ge}(单组)`, async () => {
            const self = new Self(async () => {
                return 9;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 1,
                op: (RelationOperator.nowDiff + RelationOperator.ge) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.nowDiff}${RelationOperator.ge}(单组)不通过`, async () => {
            const self = new Self(async () => {
                return 10;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 1,
                op: (RelationOperator.nowDiff + RelationOperator.ge) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.gt}(单组)`, async () => {
            const self = new Self(async () => {
                return 12;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 11,
                op: RelationOperator.gt,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.gt}(单组)不通过`, async () => {
            const self = new Self(async () => {
                return 11;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 11,
                op: RelationOperator.gt,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.nowDiff}${RelationOperator.gt}(单组)`, async () => {
            const self = new Self(async () => {
                return 8;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 1,
                op: (RelationOperator.nowDiff + RelationOperator.gt) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.nowDiff}${RelationOperator.gt}(单组)不通过`, async () => {
            const self = new Self(async () => {
                return 11;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 1,
                op: (RelationOperator.nowDiff + RelationOperator.gt) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.le}(单组)`, async () => {
            const self = new Self(async () => {
                return 11;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 11,
                op: RelationOperator.le,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.le}(单组)不通过`, async () => {
            const self = new Self(async () => {
                return 12;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 11,
                op: RelationOperator.le,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.nowDiff}${RelationOperator.lt}(单组)`, async () => {
            const self = new Self(async () => {
                return 9;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 1,
                op: (RelationOperator.nowDiff + RelationOperator.le) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.nowDiff}${RelationOperator.le}(单组)不通过`, async () => {
            const self = new Self(async () => {
                return 8;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 1,
                op: (RelationOperator.nowDiff + RelationOperator.le) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.lt}(单组)`, async () => {
            const self = new Self(async () => {
                return 10;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 11,
                op: RelationOperator.lt,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.lt}(单组)不通过`, async () => {
            const self = new Self(async () => {
                return 11;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 11,
                op: RelationOperator.lt,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.nowDiff}${RelationOperator.lt}(单组)`, async () => {
            const self = new Self(async () => {
                return 10;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 1,
                op: (RelationOperator.nowDiff + RelationOperator.lt) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.nowDiff}${RelationOperator.lt}(单组)不通过`, async () => {
            const self = new Self(async () => {
                return 8;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 1,
                op: (RelationOperator.nowDiff + RelationOperator.lt) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.mod}${RelationOperator.eq}(单组)`, async () => {
            const self = new Self(async () => {
                return 11;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 201,
                op: (RelationOperator.mod + RelationOperator.eq) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.mod}${RelationOperator.eq}(单组)不通过`, async () => {
            const self = new Self(async () => {
                return 10;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 201,
                op: (RelationOperator.mod + RelationOperator.eq) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.mod}${RelationOperator.ge}(单组)`, async () => {
            const self = new Self(async () => {
                return 11;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 200,
                op: (RelationOperator.mod + RelationOperator.ge) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.mod}${RelationOperator.ge}(单组)不通过`, async () => {
            const self = new Self(async () => {
                return 3;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 301,
                op: (RelationOperator.mod + RelationOperator.ge) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.mod}${RelationOperator.gt}(单组)`, async () => {
            const self = new Self(async () => {
                return 11;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 200,
                op: (RelationOperator.mod + RelationOperator.gt) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.mod}${RelationOperator.gt}(单组)不通过`, async () => {
            const self = new Self(async () => {
                return 3;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 301,
                op: (RelationOperator.mod + RelationOperator.gt) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.mod}${RelationOperator.le}(单组)`, async () => {
            const self = new Self(async () => {
                return 11;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 201,
                op: (RelationOperator.mod + RelationOperator.le) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.mod}${RelationOperator.le}(单组)不通过`, async () => {
            const self = new Self(async () => {
                return 2;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 301,
                op: (RelationOperator.mod + RelationOperator.le) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${RelationOperator.mod}${RelationOperator.lt}(单组)`, async () => {
            const self = new Self(async () => {
                return 10;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 201,
                op: (RelationOperator.mod + RelationOperator.lt) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${RelationOperator.mod}${RelationOperator.lt}(单组)不通过`, async () => {
            const self = new Self(async () => {
                return 2;
            }, 10, null);

            const res = await self.checkConditions([[{
                count: 301,
                op: (RelationOperator.mod + RelationOperator.lt) as RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it('all(单组)', async () => {
            const self = new Self(async (valueType: number) => {
                return {
                    1: 11,
                    2: 22,
                    3: 33
                }[valueType];
            }, 10, null);

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
            const self = new Self(async (valueType: number) => {
                return {
                    1: 11,
                    2: 22,
                    3: 33
                }[valueType];
            }, 10, null);

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
            const self = new Self(async (valueType: number) => {
                return {
                    1: 11,
                    2: 22,
                    3: 33
                }[valueType];
            }, 10, null);

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
            const self = new Self(async (arg: number) => {
                strictEqual(arg, 2);
                return 99;
            }, 10, null);

            const res = await self.checkEnough([{
                count: -1,
                valueType: 2
            }]);
            strictEqual(res, true);
        });

        it('false', async () => {
            const self = new Self(async (arg: number) => {
                strictEqual(arg, 2);
                return 0;
            }, 10, null);

            const res = await self.checkEnough([{
                count: -1,
                valueType: 2
            }]);
            strictEqual(res, false);
        });
    });

    describe('.getCount(valueType: number)', () => {
        it('ok', async () => {
            const self = new Self(
                null,
                null,
                Promise.resolve({
                    1: 11
                })
            );

            const mockValueHandler = new Mock<ValueHandlerBase>();
            self.getCountHandler = mockValueHandler.actual;

            mockValueHandler.expected.handle({
                count: 11,
                valueType: 1
            }, self);

            const res = await self.getCount(1);
            strictEqual(res, 11);
        });
    });
});