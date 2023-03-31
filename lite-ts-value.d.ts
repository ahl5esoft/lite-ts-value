import { EnumFactoryBase } from 'lite-ts-enum';
import { IUnitOfWork } from 'lite-ts-db';
type Value = {
    count: number;
    valueType: number;
} & Partial<{
    targetNo: number;
    targetType: number;
    source: string;
}>;
import { IUnitOfWork } from 'lite-ts-db';
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
import { EnumFactoryBase } from 'lite-ts-enum';
declare class FilterIsReplaceValueHandler extends ValueHandlerBase {
    private m_EnumFactory;
    constructor(m_EnumFactory: EnumFactoryBase);
    handle(option: ValueHandlerOption): Promise<void>;
}
import { EnumFactoryBase } from 'lite-ts-enum';
declare class GetAutoRecoveryValueHandler extends ValueHandlerBase {
    private enumFactory;
    private getNowFunc;
    constructor(enumFactory: EnumFactoryBase, getNowFunc: () => Promise<number>);
    handle(option: ValueHandlerOption): Promise<void>;
}
import { EnumFactoryBase } from 'lite-ts-enum';
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
import { EnumFactoryBase } from 'lite-ts-enum';
import { IRandSeedService, IUnitOfWork } from 'lite-ts-db';
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
import { EnumFactoryBase } from 'lite-ts-enum';
declare class UpdateAutoRecoveryValueHandler extends ValueHandlerBase {
    private m_EnumFactory;
    private m_GetNowFunc;
    constructor(m_EnumFactory: EnumFactoryBase, m_GetNowFunc: () => Promise<number>);
    handle(option: ValueHandlerOption): Promise<void>;
}
declare class UpdateCountValueHandler extends ValueHandlerBase {
    handle(option: ValueHandlerOption): Promise<void>;
}
import { EnumFactoryBase } from 'lite-ts-enum';
declare class UpdateIsReplaceValueHandler extends ValueHandlerBase {
    private m_EnumFactory;
    constructor(m_EnumFactory: EnumFactoryBase);
    handle(option: ValueHandlerOption): Promise<void>;
}
import { EnumFactoryBase } from 'lite-ts-enum';
declare class UpdateRangeValueHandler extends ValueHandlerBase {
    private m_EnumFactory;
    constructor(m_EnumFactory: EnumFactoryBase);
    handle(option: ValueHandlerOption): Promise<void>;
}
import { EnumFactoryBase } from 'lite-ts-enum';
declare class UpdateSyncValueHandler extends ValueHandlerBase {
    private m_EnumFactory;
    constructor(m_EnumFactory: EnumFactoryBase);
    handle(option: ValueHandlerOption): Promise<void>;
}
declare class UpdateTimeValueHandler extends TimeValueHandlerBase {
    protected handleDiff(timeValueType: number, value: Value, valueService: ValueService): Promise<void>;
}
import { EnumFactoryBase } from 'lite-ts-enum';
declare class UpdateUpgradeValueHandler extends ValueHandlerBase {
    private m_EnumFactory;
    private m_RewardService;
    constructor(m_EnumFactory: EnumFactoryBase, m_RewardService: RewardService);
    handle(option: ValueHandlerOption): Promise<void>;
}
import { EnumItem } from 'lite-ts-enum';
declare class UpgradeData extends EnumItem {
    list: {
        condition: ValueCondition[][];
        consumeValues: Value[];
        rewards: Reward[][];
    }[];
    value: number;
}
import moment from 'moment';
import { EnumItem } from 'lite-ts-enum';
declare class ValueTypeData extends EnumItem {
    static ctor: string;
    autoRecovery: {
        countdownOnValueType: number;
        interval: number;
        limitValueType: number;
    };
    expiration: {
        valueType: number;
        expirationOn: number;
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
        absValeuTypes: number[];
        valueTypes: number[];
    };
    time: {
        valueType: number;
        momentType: string;
    };
    upgrade: {
        valueType: number;
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
declare class ValueTypeUpgrade {
    [valueType: number]: number;
}
declare function valueTypeUpgradeReduce(memo: ValueTypeUpgrade, r: ValueTypeData): ValueTypeUpgrade;