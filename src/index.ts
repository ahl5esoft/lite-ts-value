import { CheckNegativeValueHandler } from './check-negative-handler';
import { FilterIsReplaceValueHandler } from './filter-is-replace-handler';
import { GetAutoRecoveryValueHandler } from './get-auto-recovery-handler';
import { GetExpireTimeValueHandler } from './get-expire-time-handler';
import { GetTimeValueHandler } from './get-time-handler';
import { Reward } from './reward';
import { RewardService } from './reward-service';
import { UpdateAutoRecoveryValueHandler } from './update-auto-recovery-handler';
import { UpdateCountValueHandler } from './update-count-handler';
import { UpdateDurationTimeValueHandler } from './update-duration-time-handler';
import { UpdateExpireTimeValueHandler } from './update-expire-time-handler';
import { UpdateIsReplaceValueHandler } from './update-is-replace-handler';
import { UpdateRangeValueHandler } from './update-range-handler';
import { UpdateSyncValueHandler } from './update-sync-handler';
import { UpdateTargetTimeValueHandler } from './update-target-time-handler';
import { UpdateTimeValueHandler } from './update-time-handler';
import { UpdateUpgradeValueHandler } from './update-upgrade-handler';
import { UpgradeData } from './upgrade-data';
import { Value } from './value';
import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerOption } from './value-handler-option';
import { ValueAfterIntercept, ValueInterceptorAfterHandler } from './value-interceptor-after-handler';
import { ValueBeforeIntercept, ValueInterceptorBeforeHandler } from './value-interceptor-before-handler';
import { IValueInterceptor, ValueInterceptorHandlerBase } from './value-interceptor-handler-base';
import { ValueService, ValueCondition } from './value-service';
import { ValueTypeData } from './value-type-data';
import { ValueTypeRewardAddition } from './value-type-reward-addition';
import { valueTypeRewardAdditionReduce } from './value-type-reward-addition-reduce';
import { ValueTypeRewardOpen } from './value-type-reward-open';
import { valueTypeRewardOpenReduce } from './value-type-reward-open-reduce';
import { valueTypeUpgradeReduce } from './value-type-upgrade-reduce';
import { ValueTypeUpgrade } from './value-type-upgrade';

export {
    CheckNegativeValueHandler,
    FilterIsReplaceValueHandler,
    GetAutoRecoveryValueHandler,
    GetExpireTimeValueHandler,
    GetTimeValueHandler,
    IValueInterceptor,
    Reward,
    RewardService,
    UpdateAutoRecoveryValueHandler,
    UpdateCountValueHandler,
    UpdateDurationTimeValueHandler,
    UpdateExpireTimeValueHandler,
    UpdateIsReplaceValueHandler,
    UpdateRangeValueHandler,
    UpdateSyncValueHandler,
    UpdateTargetTimeValueHandler,
    UpdateTimeValueHandler,
    UpdateUpgradeValueHandler,
    UpgradeData,
    Value,
    ValueAfterIntercept,
    ValueBeforeIntercept,
    ValueCondition,
    ValueHandlerBase,
    ValueHandlerOption,
    ValueInterceptorAfterHandler,
    ValueInterceptorBeforeHandler,
    ValueInterceptorHandlerBase,
    ValueService,
    ValueTypeData,
    ValueTypeRewardAddition,
    valueTypeRewardAdditionReduce,
    ValueTypeRewardOpen,
    valueTypeRewardOpenReduce,
    ValueTypeUpgrade,
    valueTypeUpgradeReduce
};
globalThis['lite-ts-value'] = {
    CheckNegativeValueHandler,
    FilterIsReplaceValueHandler,
    GetAutoRecoveryValueHandler,
    GetExpireTimeValueHandler,
    GetTimeValueHandler,
    RewardService,
    UpdateAutoRecoveryValueHandler,
    UpdateCountValueHandler,
    UpdateDurationTimeValueHandler,
    UpdateExpireTimeValueHandler,
    UpdateIsReplaceValueHandler,
    UpdateRangeValueHandler,
    UpdateSyncValueHandler,
    UpdateTargetTimeValueHandler,
    UpdateTimeValueHandler,
    UpdateUpgradeValueHandler,
    UpgradeData,
    ValueAfterIntercept,
    ValueBeforeIntercept,
    ValueHandlerBase,
    ValueInterceptorAfterHandler,
    ValueInterceptorBeforeHandler,
    ValueInterceptorHandlerBase,
    ValueService,
    ValueTypeData,
    ValueTypeRewardAddition,
    valueTypeRewardAdditionReduce,
    ValueTypeRewardOpen,
    valueTypeRewardOpenReduce,
    ValueTypeUpgrade,
    valueTypeUpgradeReduce
};
