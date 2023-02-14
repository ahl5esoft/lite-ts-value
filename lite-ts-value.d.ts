interface IValue {
    count: number;
    valueType: number;
}

declare abstract class ValueHandelrBase {
    protected next: ValueHandelrBase;
    setNext(next: ValueHandelrBase): ValueHandelrBase;
    abstract handle(value: IValue): Promise<void>;
}

declare enum RelationOperator {
    eq = "=",
    ge = ">=",
    gt = ">",
    le = "<=",
    lt = "<",
    nowDiff = "now-diff",
    mod = "%"
}
interface INowTime {
    unix(): Promise<number>;
}
interface IValueCondition extends IValue {
    op: string;
}
declare abstract class ValueServiceBase {
    protected nowTime: INowTime;
    protected ownValue: Promise<{
        [valueType: number]: number;
    }>;
    constructor(nowTime: INowTime, ownValue: Promise<{
        [valueType: number]: number;
    }>);
    checkConditions(conditions: IValueCondition[][]): Promise<boolean>;
    checkEnough(values: IValue[]): Promise<boolean>;
    getCount(valueType: number): Promise<number>;
    update(values: IValue[]): Promise<void>;
    protected abstract getGetCountHandler(valueService: ValueServiceBase): ValueHandelrBase;
    protected abstract getUpdateHandler(valueService: ValueServiceBase): ValueHandelrBase;
}

declare class UpdateCountHandler extends ValueHandelrBase {
    protected ownValue: Promise<{
        [valueType: number]: number;
    }>;
    constructor(ownValue: Promise<{
        [valueType: number]: number;
    }>);
    handle(value: IValue): Promise<void>;
}

