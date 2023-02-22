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

type Value = {
    count: number;
    valueType: number;
};

declare enum RelationOperator {
    eq = "=",
    ge = ">=",
    gt = ">",
    le = "<=",
    lt = "<",
    nowDiff = "now-diff",
    mod = "%"
}
type ValueCondition = Value & {
    op: string;
};
declare class ValueService {
    ownValue: Promise<{
        [valueType: number]: number;
    }>;
    protected getCountHandler: ValueHandlerBase;
    protected updateHandler: ValueHandlerBase;
    protected getNowFunc: () => Promise<number>;
    constructor(ownValue: Promise<{
        [valueType: number]: number;
    }>, getCountHandler: ValueHandlerBase, updateHandler: ValueHandlerBase, getNowFunc: () => Promise<number>);
    checkConditions(conditions: ValueCondition[][]): Promise<boolean>;
    checkEnough(values: Value[]): Promise<boolean>;
    getCount(valueType: number): Promise<number>;
    update(values: Value[]): Promise<void>;
}

declare abstract class ValueHandlerBase {
    protected next: ValueHandlerBase;
    setNext(next: ValueHandlerBase): ValueHandlerBase;
    abstract handle(value: Value, valueService: ValueService): Promise<void>;
}

declare class CustomError extends Error {
    code: number;
    data?: any;
    constructor(code: number, data?: any);
}
declare class CheckNegativeHandler extends ValueHandlerBase {
    private m_EnumFactory;
    static notEnoughErrorCode: number;
    constructor(m_EnumFactory: IEnumFactory);
    handle(value: Value, valueService: ValueService): Promise<void>;
}

declare class FilterIsReplaceHandler extends ValueHandlerBase {
    private m_EnumFactory;
    constructor(m_EnumFactory: IEnumFactory);
    handle(value: Value, valueService: ValueService): Promise<void>;
}

declare abstract class TimeValueHandlerBase extends ValueHandlerBase {
    protected enumFactory: IEnumFactory;
    protected getNowFunc: () => Promise<number>;
    constructor(enumFactory: IEnumFactory, getNowFunc: () => Promise<number>);
    handle(value: Value, valueService: ValueService): Promise<void>;
    protected abstract handleDiff(timeValueType: number, value: Value, valueService: ValueService): Promise<void>;
}

declare class GetTimeValueHandler extends TimeValueHandlerBase {
    protected handleDiff(_: number, value: Value): Promise<void>;
}

declare class UpdateCountHandler extends ValueHandlerBase {
    handle(value: Value, valueService: ValueService): Promise<void>;
}

declare class UpdateIsReplaceHandler extends ValueHandlerBase {
    private m_EnumFactory;
    constructor(m_EnumFactory: IEnumFactory);
    handle(value: Value, valueService: ValueService): Promise<void>;
}

declare class UpdateRangeHandler extends ValueHandlerBase {
    private m_EnumFactory;
    constructor(m_EnumFactory: IEnumFactory);
    handle(value: Value, valueService: ValueService): Promise<void>;
}

declare class UpdateSyncHandler extends ValueHandlerBase {
    private m_EnumFactory;
    constructor(m_EnumFactory: IEnumFactory);
    handle(value: Value, valueService: ValueService): Promise<void>;
}

declare class UpdateTimeHandler extends TimeValueHandlerBase {
    protected handleDiff(timeValueType: number, value: Value, valueService: ValueService): Promise<void>;
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

