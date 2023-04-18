import { ValueHandlerBase } from './value-handler-base';
import { ValueHandlerContext } from './value-handler-context';

export class UpdateCountValueHandler extends ValueHandlerBase {
    public async handle(ctx: ValueHandlerContext) {
        const ownValue = await ctx.valueService.ownValue;
        ownValue[ctx.value.valueType] ??= 0;
        ownValue[ctx.value.valueType] += ctx.value.count;

        await this.next?.handle?.(ctx);
    }
}