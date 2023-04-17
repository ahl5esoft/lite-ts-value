import { ValueHandlerOption } from './value-handler-option';
import { ValueInterceptorClientHandlerBase } from './value-interceptor-client-handler-base';
import { IValueInterceptor } from './value-interceptor-handler-base';

export class ValueInterceptorClientHandler extends ValueInterceptorClientHandlerBase {
    private m_Metadata: {
        [valueType: number]: IValueInterceptor<any>[];
    } = {};

    public ctor: string = 'ValueInterceptorClientHandler';

    constructor(
        private m_IsValidFunc: (value: any) => boolean
    ) {
        super();
    }

    public addObserver(valueType: number, observer: IValueInterceptor<any>) {
        this.m_Metadata[valueType] ??= [];
        if (!this.m_Metadata[valueType].some(r => r == observer))
            this.m_Metadata[valueType].push(observer);
    }

    public async handle(option: ValueHandlerOption) {
        if (this.m_Metadata[option.value.valueType]?.length) {
            const task = this.m_Metadata[option.value.valueType].map(async r => {
                if (this.m_IsValidFunc(r))
                    return r.intercept(option);
            });
            await Promise.all(task);
        }

        await this.next?.handle(option);
    }

    public removeObserver(observer: IValueInterceptor<any>, valueType: number) {
        if (this.m_Metadata[valueType]?.length)
            this.m_Metadata[valueType] = this.m_Metadata[valueType].filter(r => r != observer);
    }
}