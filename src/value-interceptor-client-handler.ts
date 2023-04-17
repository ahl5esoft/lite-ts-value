import { IValueObserver } from './i-value-observer';
import { ValueHandlerOption } from './value-handler-option';
import { ValueInterceptorClientHandlerBase } from './value-interceptor-client-handler-base';

export class ValueInterceptorClientHandler extends ValueInterceptorClientHandlerBase {

    public static ctor = 'ValueInterceptorClientHandler';

    private m_Observer: {
        [valueType: number]: IValueObserver[];
    } = {};

    public addObserver(valueType: number, observer: IValueObserver) {
        this.m_Observer[valueType] ??= [];
        if (!this.m_Observer[valueType].some(r => r == observer))
            this.m_Observer[valueType].push(observer);
    }

    public async handle(option: ValueHandlerOption) {
        if (this.m_Observer[option.value.valueType]?.length) {
            const task = this.m_Observer[option.value.valueType].map(async r => {
                if (this.m_IsValidFunc(r))
                    return r.notify(option);
            });
            await Promise.all(task);
        }

        await this.next?.handle(option);
    }

    public removeObserver(observer: IValueObserver, valueType: number) {
        if (this.m_Observer[valueType]?.length)
            this.m_Observer[valueType] = this.m_Observer[valueType].filter(r => r != observer);
    }
}