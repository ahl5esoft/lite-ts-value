import { IReplacer } from './i-replacer';
import { IValue } from './i-value';
import { ValueHandelrBase } from './value-hanlder-base';

export class FilterReplacerHandler extends ValueHandelrBase {
    public constructor(
        private m_Replacer: Promise<IReplacer>,
        private m_OwnValue: Promise<{ [valueType: number]: number }>,
    ) {
        super();
    }

    public async handle(value: IValue) {
        const replacer = await this.m_Replacer;
        if (replacer?.isReplace) {
            const ownValue = await this.m_OwnValue;
            const count = ownValue?.[value.valueType] ?? 0;
            if (count == value.count)
                return;
        } else if (value.count == 0) {
            return;
        }

        await this.next.handle(value);
    }
}