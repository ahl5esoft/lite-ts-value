import { IValue } from './i-value';
import { IReplacer } from './i-replacer';
import { ValueHandelrBase } from './value-hanlder-base';

export class UpdateReplacerHandler extends ValueHandelrBase {
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
            ownValue[value.valueType] = 0;
        }

        await this.next?.handle?.(value);
    }
}