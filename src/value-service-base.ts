import { CustomError } from './custom-error';
import { INowTime } from './i-now-time';
import { IValue } from './i-value';
import { IValueCondition } from './i-value-condition';
import { RelationOperator } from './relation-operator';

export abstract class ValueServiceBase {
    public constructor(
        protected nowTime: INowTime,
        protected notEnoughtErrorCode: number,
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

    public async checkEnough(times: number, values: IValue[]) {
        for (const r of values) {
            const count = await this.getCount(r.valueType);
            if (count + r.count * times < 0) {
                throw new CustomError(this.notEnoughtErrorCode, {
                    consume: Math.abs(r.count * times),
                    count: count,
                    valueType: r.valueType,
                });
            }
        }
    }

    public async mustCheckEnough(times: number, values: IValue[]) {
        try {
            await this.checkEnough(times, values);
            return true;
        } catch {
            return false;
        }
    }

    public abstract getCount(valueType: number): Promise<number>;
    public abstract update(values: IValue[]): Promise<void>;
}