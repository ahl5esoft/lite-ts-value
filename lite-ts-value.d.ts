interface IEnumItem {
    readonly value: number;
    readonly key?: string;
    readonly text?: string;
}
interface IEnum<T extends IEnumItem> {
    readonly allItem: Promise<{
        [no: number]: T;
    }>;
}
interface IEnumFactory {
    build<T extends IEnumItem>(name: string): IEnum<T>;
}

interface IValue {
    count: number;
    valueType: number;
}

declare abstract class ValueHandelrBase {
    protected next: ValueHandelrBase;
    setNext(next: ValueHandelrBase): ValueHandelrBase;
    abstract handle(value: IValue): Promise<void>;
}

declare class CustomError extends Error {
    code: number;
    data?: any;
    constructor(code: number, data?: any);
}
declare class CheckNegativeHandler extends ValueHandelrBase {
    private m_EnumFactory;
    private m_OwnValue;
    static notEnoughErrorCode: number;
    constructor(m_EnumFactory: IEnumFactory, m_OwnValue: Promise<{
        [valueType: number]: number;
    }>);
    handle(value: IValue): Promise<void>;
}

declare class FilterIsReplaceHandler extends ValueHandelrBase {
    private m_EnumFactory;
    private m_OwnValue;
    constructor(m_EnumFactory: IEnumFactory, m_OwnValue: Promise<{
        [valueType: number]: number;
    }>);
    handle(value: IValue): Promise<void>;
}

declare abstract class TimeHandlerBase extends ValueHandelrBase {
    protected enumFactory: IEnumFactory;
    protected now: Promise<number>;
    protected ownValue: Promise<{
        [valueType: number]: number;
    }>;
    constructor(enumFactory: IEnumFactory, now: Promise<number>, ownValue: Promise<{
        [valueType: number]: number;
    }>);
    handle(value: IValue): Promise<void>;
    protected abstract handleDiff(value: IValue, timeValueType: number): Promise<void>;
}

declare class GetTimeValueHandler extends TimeHandlerBase {
    protected handleDiff(value: IValue): Promise<void>;
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

declare class UpdateIsReplaceHandler extends ValueHandelrBase {
    private m_EnumFactory;
    private m_OwnValue;
    constructor(m_EnumFactory: IEnumFactory, m_OwnValue: Promise<{
        [valueType: number]: number;
    }>);
    handle(value: IValue): Promise<void>;
}

declare class UpdateRangeHandler extends ValueHandelrBase {
    private m_EnumFactory;
    private m_OwnValue;
    constructor(m_EnumFactory: IEnumFactory, m_OwnValue: Promise<{
        [valueType: number]: number;
    }>);
    handle(value: IValue): Promise<void>;
}

declare class UpdateSyncHandler extends ValueHandelrBase {
    private m_EnumFactory;
    private m_ValueService;
    constructor(m_EnumFactory: IEnumFactory, m_ValueService: ValueServiceBase);
    handle(value: IValue): Promise<void>;
}

declare class UpdateTimeHandler extends TimeHandlerBase {
    protected handleDiff(value: IValue, timeValueType: number): Promise<void>;
}

declare class ValueTypeData implements IEnumItem {
    isNegative: boolean;
    isReplace: boolean;
    value: number;
    text: string;
    range: {
        max: number;
        min: number;
    };
    sync: {
        valueTypes: number[];
    };
    time: {
        valueType: number;
        momentType: string;
    };
}

