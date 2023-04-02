import { TargetHandlerBase } from './target-handler-base';
import { Value } from './value';

export class GetTargetValueHandler extends TargetHandlerBase {
    protected async handleDiff(value: Value) {
        value.count = 0;
    }
}