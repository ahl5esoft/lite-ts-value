import { strictEqual } from 'assert';
import { Enum, EnumFactoryBase } from 'lite-ts-enum';
import { Mock, mockAny } from 'lite-ts-mock';

import { ValueAfterIntercept, ValueInterceptorAfterHandler } from './value-interceptor-after-handler';
import { ValueBeforeIntercept, ValueInterceptorBeforeHandler } from './value-interceptor-before-handler';
import { IValueInterceptor, ValueInterceptorHandlerBase } from './value-interceptor-handler-base';
import { ValueTypeData } from './value-type-data';

class AfterHandler extends ValueInterceptorHandlerBase {
    protected get metadata() {
        return ValueInterceptorAfterHandler.metadata;
    }
}

@ValueAfterIntercept((data: ValueTypeData) => {
    return data.value == 1;
})
class ValueAfterPredicate implements IValueInterceptor<void> {
    public intercept(): Promise<void> {
        return;
    }
}

@ValueAfterIntercept(10)
class ValueAfterValueType implements IValueInterceptor<void> {
    public intercept(): Promise<void> {
        return;
    }
}

class BeforeHandler extends ValueInterceptorHandlerBase {
    protected get metadata() {
        return ValueInterceptorBeforeHandler.metadata;
    }
}

@ValueBeforeIntercept((data: ValueTypeData) => {
    return data.value == 1;
})
class ValueBeforePredicate implements IValueInterceptor<boolean> {
    public async intercept(): Promise<boolean> {
        return true;
    }
}

@ValueBeforeIntercept(10)
class ValueBeforeValueType implements IValueInterceptor<boolean> {
    public async intercept(): Promise<boolean> {
        return false;
    }
}

describe('src/service/value/value-interceptor-handler.ts', () => {
    describe('.handle(option: ValueHandlerOption)', () => {
        it('add-or-remove-after-client', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new AfterHandler(mockEnumFactory.actual);

            const mockEnum = new Mock<Enum<ValueTypeData>>({
                allItem: {
                    2: {
                        value: 2
                    }
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build(mockAny, undefined),
                mockEnum.actual
            );
            self.addObserver((data: ValueTypeData) => {
                return data.value == 2;
            }, ValueAfterPredicate);

            const option = {
                value: {
                    valueType: 2
                }
            } as any;
            await self.handle(option);
            self.removeObserver(2);
            strictEqual(ValueInterceptorAfterHandler.metadata.valueType[2], undefined);
        });

        it('add-or-remove-before-client', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new BeforeHandler(mockEnumFactory.actual);

            const mockEnum = new Mock<Enum<ValueTypeData>>({
                allItem: {
                    2: {
                        value: 2
                    }
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build(mockAny, undefined),
                mockEnum.actual
            );
            self.addObserver((data: ValueTypeData) => {
                return data.value == 2;
            }, ValueBeforePredicate);

            const option = {
                value: {
                    valueType: 2
                }
            } as any;
            await self.handle(option);
            self.removeObserver(2);
            strictEqual(ValueInterceptorBeforeHandler.metadata.valueType[2], undefined);
        });

        it('after-predicate', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new AfterHandler(mockEnumFactory.actual);

            const mockEnum = new Mock<Enum<ValueTypeData>>({
                allItem: {
                    1: {
                        value: 1
                    }
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build(mockAny, undefined),
                mockEnum.actual
            );

            const option = {
                value: {
                    valueType: 1
                }
            } as any;
            await self.handle(option);
            strictEqual(ValueInterceptorAfterHandler.metadata.valueType[1], ValueAfterPredicate);
        });

        it('after-value-type', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new AfterHandler(mockEnumFactory.actual);

            const mockEnum = new Mock<Enum<ValueTypeData>>({
                allItem: {
                    10: {
                        value: 10
                    }
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build(mockAny, undefined),
                mockEnum.actual
            );

            const option = {
                value: {
                    valueType: 10
                }
            } as any;
            await self.handle(option);
            strictEqual(ValueInterceptorAfterHandler.metadata.valueType[10], ValueAfterValueType);
        });

        it('before-predicate', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new BeforeHandler(mockEnumFactory.actual);

            const mockEnum = new Mock<Enum<ValueTypeData>>({
                allItem: {
                    1: {
                        value: 1
                    }
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build(mockAny, undefined),
                mockEnum.actual
            );

            const option = {
                value: {
                    valueType: 1
                }
            } as any;
            await self.handle(option);
            strictEqual(ValueInterceptorBeforeHandler.metadata.valueType[1], ValueBeforePredicate);
        });

        it('before-value-type', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new BeforeHandler(mockEnumFactory.actual);

            const mockEnum = new Mock<Enum<ValueTypeData>>({
                allItem: {
                    10: {
                        value: 10
                    }
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build(mockAny, undefined),
                mockEnum.actual
            );

            const option = {
                value: {
                    valueType: 10
                }
            } as any;
            await self.handle(option);
            strictEqual(ValueInterceptorBeforeHandler.metadata.valueType[10], ValueBeforeValueType);
        });
    });
});