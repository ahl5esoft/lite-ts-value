import { IValueObserver } from './i-value-observer';
import { ValueHandlerContext } from './value-handler-context';
import { ValueInterceptorClientHandlerBase } from './value-observer-handler-base';

export class ValueInterceptorClientHandler extends ValueInterceptorClientHandlerBase {

    public static ctor = 'ValueInterceptorClientHandler';

    private m_Observer: {
        [valueType: number]: IValueObserver<any>[];
    } = {};

    public addObserver(valueType: number, observer: IValueObserver<any>) {
        this.m_Observer[valueType] ??= [];
        if (!this.m_Observer[valueType].some(r => r == observer))
            this.m_Observer[valueType].push(observer);
    }

    public async handle(ctx: ValueHandlerContext) {
        if (this.m_Observer[ctx.value.valueType]?.length) {
            const task = this.m_Observer[ctx.value.valueType].map(async r => {
                if (this.m_IsValidFunc(r))
                    return r.notify(ctx);
            });
            await Promise.all(task);
        }

        await this.next?.handle(ctx);
    }

    public removeObserver(observer: IValueObserver<any>, valueType: number) {
        if (this.m_Observer[valueType]?.length)
            this.m_Observer[valueType] = this.m_Observer[valueType].filter(r => r != observer);
    }
}