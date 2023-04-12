import { ValueHandlerOption } from './value-handler-option';
import { ValueTypeData } from './value-type-data';

export interface IValueInterceptor {
    notify(option: ValueHandlerOption): Promise<boolean>;
}

/**
 * 更新前数值拦截元数据
 */
export const valueInterceptorMetadata = {
    /**
     * 断言
     */
    predicates: [] as {
        /**
         * 构造函数
         */
        ctor: new () => IValueInterceptor;
        /**
         * 行为
         */
        operation: string;
        /**
         * 断言
         */
        predicate: (valueType: ValueTypeData) => boolean;
    }[],
    /**
     * 数值类型
     */
    valueType: {} as {
        [valueType: number]: {
            [operation: string]: new () => IValueInterceptor;
        };
    }
};