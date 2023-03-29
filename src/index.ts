import { CheckNegativeValueHandler } from './check-negative-handler';
import { FilterIsReplaceValueHandler } from './filter-is-replace-handler';
import { GetAutoRecoveryValueHandler } from './get-auto-recovery-handler';
import { GetTimeValueHandler } from './get-time-handler';
import { ILuckyDrawService } from './i-lucky-draw-service';
import { LuckyDrawFactoryBase } from './lucky-draw-factory-base';
import { LuckyDrawFactory } from './lucky-draw-factory';
import { RewardService } from './reward-service';
import { UpdateAutoRecoveryValueHandler } from './update-auto-recovery-handler';
import { UpdateCountValueHandler } from './update-count-handler';
import { UpdateIsReplaceValueHandler } from './update-is-replace-handler';
import { UpdateRangeValueHandler } from './update-range-handler';
import { UpdateSyncValueHandler } from './update-sync-handler';
import { UpdateTimeValueHandler } from './update-time-handler';
import { Value } from './value';
import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { ValueService } from './value-service';
import { ValueTypeData } from './value-type-data';
import { ValueTypeRewardAddition } from './value-type-reward-addition';
import { valueTypeRewardAdditionReduce } from './value-type-reward-addition-reduce';
import { ValueTypeRewardOpen } from './value-type-reward-open';
import { valueTypeRewardOpenReduce } from './value-type-reward-open-reduce';

export {
    CheckNegativeValueHandler,
    FilterIsReplaceValueHandler,
    GetAutoRecoveryValueHandler,
    GetTimeValueHandler,
    ILuckyDrawService,
    LuckyDrawFactoryBase,
    LuckyDrawFactory,
    RewardService,
    UpdateAutoRecoveryValueHandler,
    UpdateCountValueHandler,
    UpdateIsReplaceValueHandler,
    UpdateRangeValueHandler,
    UpdateSyncValueHandler,
    UpdateTimeValueHandler,
    Value,
    ValueHandlerBase,
    ValueHandlerOption,
    ValueService,
    ValueTypeData,
    ValueTypeRewardAddition,
    valueTypeRewardAdditionReduce,
    ValueTypeRewardOpen,
    valueTypeRewardOpenReduce,
};
globalThis['lite-ts-value'] = {
    CheckNegativeValueHandler,
    FilterIsReplaceValueHandler,
    GetAutoRecoveryValueHandler,
    GetTimeValueHandler,
    LuckyDrawFactoryBase,
    LuckyDrawFactory,
    RewardService,
    UpdateAutoRecoveryValueHandler,
    UpdateCountValueHandler,
    UpdateIsReplaceValueHandler,
    UpdateRangeValueHandler,
    UpdateSyncValueHandler,
    UpdateTimeValueHandler,
    ValueHandlerBase,
    ValueService,
    ValueTypeData,
    ValueTypeRewardAddition,
    valueTypeRewardAdditionReduce,
    ValueTypeRewardOpen,
    valueTypeRewardOpenReduce,
};
