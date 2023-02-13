interface IValue {
    count: number;
    valueType: number;
}

type BuildNotEnoughErrorFunc = (consume: number, count: number, valueType: number) => Error;

declare abstract class ValueHandelrBase {
    protected next: ValueHandelrBase;
    setNext(next: ValueHandelrBase): ValueHandelrBase;
    abstract handle(value: IValue): Promise<void>;
}

interface INegative {
    readonly isNegative: boolean;
}
declare class CheckNegativeHandler extends ValueHandelrBase {
    private m_Negative;
    private m_OwnValue;
    private m_BuildNotEnoughErrorFunc;
    constructor(m_Negative: Promise<INegative>, m_OwnValue: Promise<{
        [valueType: number]: number;
    }>, m_BuildNotEnoughErrorFunc: BuildNotEnoughErrorFunc);
    handle(value: IValue): Promise<void>;
}

interface IReplacer {
    readonly isReplace: boolean;
}

declare class FilterReplacerHandler extends ValueHandelrBase {
    private m_Replacer;
    private m_OwnValue;
    constructor(m_Replacer: Promise<IReplacer>, m_OwnValue: Promise<{
        [valueType: number]: number;
    }>);
    handle(value: IValue): Promise<void>;
}

interface ITime {
    valueType: number;
    momentType: string;
}
declare abstract class TimeHandlerBase extends ValueHandelrBase {
    protected time: Promise<ITime>;
    protected now: Promise<number>;
    protected ownValue: Promise<{
        [valueType: number]: number;
    }>;
    constructor(time: Promise<ITime>, now: Promise<number>, ownValue: Promise<{
        [valueType: number]: number;
    }>);
    handle(value: IValue): Promise<void>;
    protected abstract handleDiff(value: IValue): Promise<void>;
}

declare class GetTimeHandler extends TimeHandlerBase {
    protected handleDiff(value: IValue): Promise<void>;
}

interface IValueCondition extends IValue {
    op: string;
}

interface IValueService {
    checkConditions(conditions: IValueCondition[][]): Promise<boolean>;
    checkEnough(times: number, values: IValue[]): Promise<boolean>;
    getCount(valueType: number): Promise<number>;
    tryCheckEnough(times: number, values: IValue[]): Promise<void>;
    update(values: IValue[]): Promise<void>;
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
declare class ValueService implements IValueService {
    protected nowTime: INowTime;
    protected ownValue: Promise<{
        [valueType: number]: number;
    }>;
    protected getCountHandler: ValueHandelrBase;
    protected updateHandler: ValueHandelrBase;
    protected buildNotEnoughErrorFunc: BuildNotEnoughErrorFunc;
    constructor(nowTime: INowTime, ownValue: Promise<{
        [valueType: number]: number;
    }>, getCountHandler: ValueHandelrBase, updateHandler: ValueHandelrBase, buildNotEnoughErrorFunc: BuildNotEnoughErrorFunc);
    checkConditions(conditions: IValueCondition[][]): Promise<boolean>;
    checkEnough(times: number, values: IValue[]): Promise<boolean>;
    getCount(valueType: number): Promise<number>;
    tryCheckEnough(times: number, values: IValue[]): Promise<void>;
    update(values: IValue[]): Promise<void>;
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

interface IRange {
    readonly max: number;
    readonly min: number;
}
declare class UpdateRangeHandler extends ValueHandelrBase {
    private m_Range;
    private m_OwnValue;
    constructor(m_Range: Promise<IRange>, m_OwnValue: Promise<{
        [valueType: number]: number;
    }>);
    handle(value: IValue): Promise<void>;
}

interface ISync {
    valueTypes: number[];
}
declare class UpdateSyncHandler extends ValueHandelrBase {
    private m_ValueService;
    private m_Sync;
    constructor(m_ValueService: IValueService, m_Sync: Promise<ISync>);
    handle(value: IValue): Promise<void>;
}

