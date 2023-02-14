import { IValue } from './i-value';
import { ValueHandelrBase } from './value-hanlder-base';

export enum RelationOperator {
    eq = '=',
    ge = '>=',
    gt = '>',
    le = '<=',
    lt = '<',
    nowDiff = 'now-diff',
    mod = '%'
}

export interface INowTime {
    unix(): Promise<number>;
}

export interface IValueCondition extends IValue {
    op: string;
}

export abstract class ValueServiceBase {
    public constructor(
        protected nowTime: INowTime,
        protected ownValue: Promise<{ [valueType: number]: number }>,
    ) { }

    public async checkConditions(conditions: IValueCondition[][]) {
        if (!conditions?.length)
            return true;

        const now = await this.nowTime.unix();
        for (const r of conditions) {
            const tasks = r.map(async cr => {
                let aCount = await this.getCount(cr.valueType);
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
                        return aCount > bCount
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

    public async checkEnough(values: IValue[]) {
        for (const r of values) {
            const count = await this.getCount(r.valueType);
            if (count + r.count < 0)
                return false;
        }

        return true;
    }

    public async getCount(valueType: number) {
        valueType = Number(valueType);
        if (isNaN(valueType))
            return 0;

        const ownValue = await this.ownValue;
        const res = {
            count: ownValue[valueType] ?? 0,
            valueType,
        };
        await this.getGetCountHandler(this)?.handle?.(res);
        return res.count;
    }

    public async update(values: IValue[]) {
        if (!values?.length)
            return;

        for (const r of values) {
            r.valueType = Number(r.valueType);
            if (isNaN(r.valueType))
                continue;

            r.count = Number(r.count);
            if (isNaN(r.count))
                continue;

            await this.getUpdateHandler(this)?.handle?.({
                ...r
            });
        }
    }

    protected abstract getGetCountHandler(valueService: ValueServiceBase): ValueHandelrBase;
    protected abstract getUpdateHandler(valueService: ValueServiceBase): ValueHandelrBase;
}