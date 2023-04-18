import { IUnitOfWork } from 'lite-ts-db';

import { Value } from './value';
import { ValueHandlerBase } from './value-handler-base';
import { ValueCondition } from './value-condition';

export enum RelationOperator {
    eq = '=',
    ge = '>=',
    gt = '>',
    le = '<=',
    lt = '<',
    nowDiff = 'now-diff',
    mod = '%'
}

export class ValueService {
    public constructor(
        public ownValue: Promise<{ [valueType: number]: number; }>,
        protected getCountHandler: ValueHandlerBase,
        protected updateHandler: ValueHandlerBase,
        protected getNowFunc: () => Promise<number>,
        private m_AreaNo?: number
    ) { }

    public async checkConditions(uow: IUnitOfWork, conditions: ValueCondition[][]) {
        if (!conditions?.length)
            return true;

        const now = await this.getNowFunc();
        for (const r of conditions) {
            const tasks = r.map(async cr => {
                let aCount = await this.getCount(uow, cr.valueType);
                let bCount = cr.count;
                let op: string = cr.op;
                if (cr.op.includes(RelationOperator.nowDiff)) {
                    aCount = now - aCount;
                    op = cr.op.replace(RelationOperator.nowDiff, '');
                } else if (cr.op.includes(RelationOperator.mod)) {
                    aCount = aCount % Math.floor(cr.count / 100);
                    op = cr.op.replace(RelationOperator.mod, '');
                    bCount = bCount % 100;
                }
                switch (op) {
                    case RelationOperator.ge:
                        return aCount >= bCount;
                    case RelationOperator.gt:
                        return aCount > bCount;
                    case RelationOperator.le:
                        return aCount <= bCount;
                    case RelationOperator.lt:
                        return aCount < bCount;
                    default:
                        return aCount == bCount;
                }
            });
            const res = await Promise.all(tasks);
            const ok = res.every(cr => cr);
            if (ok)
                return ok;
        }

        return false;
    }

    public async checkEnough(uow: IUnitOfWork, values: Value[]) {
        for (const r of values) {
            const count = await this.getCount(uow, r.valueType);
            if (count + r.count < 0)
                return false;
        }

        return true;
    }

    public async getCount(uow: IUnitOfWork, valueType: number) {
        valueType = Number(valueType);
        if (isNaN(valueType))
            return 0;

        const ownValue = await this.ownValue;
        const res = {
            count: ownValue[valueType] ?? 0,
            valueType,
        };
        await this.getCountHandler?.handle?.({
            uow: uow,
            value: res,
            valueService: this
        });
        return res.count;
    }

    public async update(uow: IUnitOfWork, values: Value[]) {
        if (!values?.length)
            return;

        for (const r of values) {
            r.valueType = Number(r.valueType);
            if (isNaN(r.valueType))
                continue;

            r.count = Number(r.count);
            if (isNaN(r.count))
                continue;

            await this.updateHandler?.handle?.({
                uow: uow,
                areaNo: this.m_AreaNo,
                value: { ...r },
                valueService: this
            });
        }
    }
}