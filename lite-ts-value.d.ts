declare class EnumItem {
    value: number;
    key?: string;
    text?: string;
}
type LoadEnumHandleOption = {
    enum: Enum<any>;
    res: {
        [no: number]: any;
    };
    areaNo?: number;
};
declare abstract class LoadEnumHandlerBase {
    protected next: LoadEnumHandlerBase;
    setNext(v: LoadEnumHandlerBase): LoadEnumHandlerBase;
    abstract handle(opt: LoadEnumHandleOption): Promise<void>;
}
declare class Enum<T extends EnumItem> {
    name: string;
    private m_AreaNo;
    private m_LoadHandler;
    private m_ReduceFunc;
    private m_Reduce;
    private m_AllItem;
    get allItem(): Promise<{
        [no: number]: T;
    }>;
    get items(): Promise<T[]>;
    constructor(name: string, m_AreaNo: number, m_LoadHandler: LoadEnumHandlerBase, m_ReduceFunc: {
        [key: string]: (memo: any, item: T) => any;
    });
    get(predicate: (entry: T) => boolean): Promise<T>;
    getReduce<TReduce>(typer: string): Promise<TReduce>;
}
declare abstract class EnumFactoryBase {
    static ctor: string;
    abstract build<T extends EnumItem>(nameOrCtor: string | (new () => T), areaNo?: number): Enum<T>;
}
declare class EnumFactory extends EnumFactoryBase {
    private m_LoadHandler;
    private m_ReduceFunc;
    constructor(m_LoadHandler: LoadEnumHandlerBase, m_ReduceFunc: {
        [key: string]: (memo: any, item: any) => any;
    });
    build<T extends EnumItem>(nameOrCtor: string | (new () => T), areaNo?: number): Enum<any>;
}
type Value = {
    count: number;
    valueType: number;
} & Partial<{
    targetNo: number;
    targetType: number;
    source: string;
}>;
type Reward = Value & {
    weight?: number;
};
type ValueCondition = Value & {
    op: string;
};
declare class ValueTypeData extends EnumItem {
    autoRecovery: {
        countdownOnValueType: number;
        interval: number;
        limitValueType: number;
    };
    isNegative: boolean;
    isReplace: boolean;
    parser?: {
        exp: string;
    };
    range: {
        max: number;
        min: number;
    };
    reward: {
        addition: {
            childValueType: number;
            mainValueType: number;
        };
        open: Reward[][];
    };
    sync: {
        valueTypes: number[];
    };
    text: string;
    time: {
        valueType: number;
        momentType: string;
    };
    value: number;
}
type DbQueryOption<T> = Partial<{
    skip: number;
    take: number;
    where: T;
    order: string[];
    orderByDesc: string[];
}>;
interface IDbQuery<T> {
    count(where?: any): Promise<number>;
    toArray(v?: DbQueryOption<any>): Promise<T[]>;
}
interface IDbRepository<T> {
    add(entry: T): Promise<void>;
    remove(entry: T): Promise<void>;
    save(entry: T): Promise<void>;
    query(): IDbQuery<T>;
}
interface IUnitOfWork {
    commit(): Promise<void>;
    registerAfter(action: () => Promise<void>, key?: string): void;
}
declare class DbModel {
    readonly id: string;
}
type DbOption = (dbFactory: DbFactoryBase, dbRepo: IDbRepository<DbModel>) => void;
declare abstract class DbFactoryBase {
    abstract db<T extends DbModel>(...opts: DbOption[]): IDbRepository<T>;
    abstract uow(): IUnitOfWork;
}
declare abstract class AreaDbFactoryBase extends DbFactoryBase {
    abstract getAreaDbFactory(areaNo: number): Promise<DbFactoryBase>;
}
declare class AreaDbQuery<T extends DbModel> implements IDbQuery<T> {
    private m_AreaNo;
    private m_DbFactory;
    private m_DbOptions;
    constructor(m_AreaNo: number, m_DbFactory: AreaDbFactoryBase, m_DbOptions: DbOption[]);
    count(where?: any): Promise<number>;
    toArray(v?: DbQueryOption<any>): Promise<T[]>;
}
interface IUnitOfWorkRepository extends IUnitOfWork {
    registerAdd(model: string, entry: any): void;
    registerRemove(model: string, entry: any): void;
    registerSave(model: string, entry: any): void;
}
declare class AreaDbModel {
    areaNo: number;
    entry: DbModel;
    get id(): string;
    constructor(areaNo: number, entry: DbModel);
}
declare function uowDbOption(uow: IUnitOfWork): DbOption;
declare function areaDbOption(areaNo: number): DbOption;
declare class DbRepository<T extends DbModel> implements IDbRepository<T> {
    uow: IUnitOfWorkRepository;
    isTx: boolean;
    areaNo: number;
    model: string;
    dbOptions: DbOption[];
    private m_CreateQueryFunc;
    createQueryFunc(v: () => IDbQuery<T>): void;
    constructor(uow: IUnitOfWorkRepository);
    add(entry: T): Promise<void>;
    query(): IDbQuery<T>;
    remove(entry: T): Promise<void>;
    save(entry: T): Promise<void>;
    private exec;
}
declare class AreaUnitOfWork implements IUnitOfWorkRepository {
    private m_DbFactory;
    private m_GlobalDbFactory;
    private m_AfterAction;
    private m_Bulk;
    constructor(m_DbFactory: AreaDbFactoryBase, m_GlobalDbFactory: DbFactoryBase);
    commit(): Promise<void>;
    registerAdd(model: string, entry: AreaDbModel): void;
    registerAfter(action: () => Promise<void>, key?: string): void;
    registerRemove(model: string, entry: AreaDbModel): void;
    registerSave(model: string, entry: AreaDbModel): void;
    private register;
}
interface IRandSeedService {
    get(uow: IUnitOfWork, len: number, offset?: number): Promise<number>;
    use(uow: IUnitOfWork, len: number): Promise<number>;
}
type Value = {
    count: number;
    valueType: number;
} & Partial<{
    targetNo: number;
    targetType: number;
    source: string;
}>;
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
    private m_AreaNo?;
    constructor(ownValue: Promise<{
        [valueType: number]: number;
    }>, getCountHandler: ValueHandlerBase, updateHandler: ValueHandlerBase, getNowFunc: () => Promise<number>, m_AreaNo?: number);
    checkConditions(uow: IUnitOfWork, conditions: ValueCondition[][]): Promise<boolean>;
    checkEnough(uow: IUnitOfWork, values: Value[]): Promise<boolean>;
    getCount(uow: IUnitOfWork, valueType: number): Promise<number>;
    update(uow: IUnitOfWork, values: Value[]): Promise<void>;
}
type ValueHandlerOption = {
    value: Value;
    valueService: ValueService;
    areaNo?: number;
    uow?: IUnitOfWork;
};
declare abstract class ValueHandlerBase {
    protected next: ValueHandlerBase;
    setNext(next: ValueHandlerBase): ValueHandlerBase;
    abstract handle(option: ValueHandlerOption): Promise<void>;
}
declare class CustomError extends Error {
    code: number;
    data?: any;
    constructor(code: number, data?: any);
}
declare class CheckNegativeValueHandler extends ValueHandlerBase {
    private m_EnumFactory;
    static notEnoughErrorCode: number;
    constructor(m_EnumFactory: EnumFactoryBase);
    handle(option: ValueHandlerOption): Promise<void>;
}
declare class FilterIsReplaceValueHandler extends ValueHandlerBase {
    private m_EnumFactory;
    constructor(m_EnumFactory: EnumFactoryBase);
    handle(option: ValueHandlerOption): Promise<void>;
}
declare class GetAutoRecoveryValueHandler extends ValueHandlerBase {
    private enumFactory;
    private getNowFunc;
    constructor(enumFactory: EnumFactoryBase, getNowFunc: () => Promise<number>);
    handle(option: ValueHandlerOption): Promise<void>;
}
declare abstract class TimeValueHandlerBase extends ValueHandlerBase {
    protected enumFactory: EnumFactoryBase;
    protected getNowFunc: () => Promise<number>;
    constructor(enumFactory: EnumFactoryBase, getNowFunc: () => Promise<number>);
    handle(option: ValueHandlerOption): Promise<void>;
    protected abstract handleDiff(timeValueType: number, value: Value, valueService: ValueService): Promise<void>;
}
declare class GetTimeValueHandler extends TimeValueHandlerBase {
    protected handleDiff(_: number, value: Value): Promise<void>;
}
type Reward = Value & {
    weight?: number;
};
declare class RewardService {
    private m_RandSeedService;
    private m_EnumFactory;
    private m_ValueService;
    private m_AreaNo?;
    constructor(m_RandSeedService: IRandSeedService, m_EnumFactory: EnumFactoryBase, m_ValueService: ValueService, m_AreaNo?: number);
    findResults(uow: IUnitOfWork, rewards: Reward[][], source?: string): Promise<Value[]>;
    preview(uow: IUnitOfWork, rewards: Reward[][], offset?: number): Promise<{
        offset: number;
        values: Value[];
    }>;
    private findOpenRewards;
}
declare class UpdateAutoRecoveryValueHandler extends ValueHandlerBase {
    private m_EnumFactory;
    private m_GetNowFunc;
    constructor(m_EnumFactory: EnumFactoryBase, m_GetNowFunc: () => Promise<number>);
    handle(option: ValueHandlerOption): Promise<void>;
}
declare class UpdateCountValueHandler extends ValueHandlerBase {
    handle(option: ValueHandlerOption): Promise<void>;
}
declare class UpdateIsReplaceValueHandler extends ValueHandlerBase {
    private m_EnumFactory;
    constructor(m_EnumFactory: EnumFactoryBase);
    handle(option: ValueHandlerOption): Promise<void>;
}
declare class UpdateRangeValueHandler extends ValueHandlerBase {
    private m_EnumFactory;
    constructor(m_EnumFactory: EnumFactoryBase);
    handle(option: ValueHandlerOption): Promise<void>;
}
declare class UpdateSyncValueHandler extends ValueHandlerBase {
    private m_EnumFactory;
    constructor(m_EnumFactory: EnumFactoryBase);
    handle(option: ValueHandlerOption): Promise<void>;
}
declare class UpdateTimeValueHandler extends TimeValueHandlerBase {
    protected handleDiff(timeValueType: number, value: Value, valueService: ValueService): Promise<void>;
}
declare class ValueTypeData extends EnumItem {
    static ctor: string;
    autoRecovery: {
        countdownOnValueType: number;
        interval: number;
        limitValueType: number;
    };
    isNegative: boolean;
    isReplace: boolean;
    value: number;
    text: string;
    range: {
        max: number;
        min: number;
    };
    reward: {
        addition: {
            childValueType: number;
            mainValueType: number;
        };
        open: Reward[][];
    };
    sync: {
        valueTypes: number[];
    };
    time: {
        valueType: number;
        momentType: string;
    };
}
declare class ValueTypeRewardAddition {
    static ctor: string;
    [mainValueType: number]: {
        [childValueType: number]: number;
    };
}
declare function valueTypeRewardAdditionReduce(memo: ValueTypeRewardAddition, r: ValueTypeData): ValueTypeRewardAddition;
declare class ValueTypeRewardOpen {
    static ctor: string;
    [valueType: number]: Reward[][];
}
declare function valueTypeRewardOpenReduce(memo: ValueTypeRewardOpen, r: ValueTypeData): ValueTypeRewardOpen;
{ CheckNegativeValueHandler, FilterIsReplaceValueHandler, GetAutoRecoveryValueHandler, GetTimeValueHandler, RewardService, UpdateAutoRecoveryValueHandler, UpdateCountValueHandler, UpdateIsReplaceValueHandler, UpdateRangeValueHandler, UpdateSyncValueHandler, UpdateTimeValueHandler, Value, ValueHandlerBase, ValueHandlerOption, ValueService, ValueTypeData, ValueTypeRewardAddition, valueTypeRewardAdditionReduce, ValueTypeRewardOpen, valueTypeRewardOpenReduce, };