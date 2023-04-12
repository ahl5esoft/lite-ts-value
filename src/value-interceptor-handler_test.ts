import { strictEqual } from 'assert';
import { Enum, EnumFactoryBase } from 'lite-ts-enum';
import { Mock, mockAny } from 'lite-ts-mock';

import { ValueInterceptorHandler as Self } from './value-interceptor-handler';
import { ValueIntercept } from './value-interceptor-decorator';
import { IValueInterceptor, valueInterceptorMetadata } from './value-interceptor-metadata';
import { ValueTypeData } from './value-type-data';

@ValueIntercept((data: ValueTypeData) => {
    return data.value == 1;
}, 'after')
class AfterPredicateValueInterceptor implements IValueInterceptor {
    public async notify() {
        return false;
    }
}

@ValueIntercept(10, 'after')
class AfterValueTypeValueInterceptor implements IValueInterceptor {
    public async notify() {
        return false;
    }
}

@ValueIntercept((data: ValueTypeData) => {
    return data.value == 1;
}, 'before')
class BeforePredicateValueInterceptor implements IValueInterceptor {
    public async notify() {
        return true;
    }
}

@ValueIntercept(10, 'before')
class BeforeValueTypeValueInterceptor implements IValueInterceptor {
    public async notify() {
        return false;
    }
}

describe('src/service/value/value-interceptor-handler.ts', () => {
    describe('.handle(option: ValueHandlerOption)', () => {
        it('after-predicate', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(mockEnumFactory.actual, 'after');

            const mockEnum = new Mock<Enum<ValueTypeData>>({
                allItem: {
                    1: {
                        value: 1
                    }
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build(mockAny),
                mockEnum.actual
            );

            const option = {
                value: {
                    valueType: 1
                }
            } as any;
            await self.handle(option);
            strictEqual(valueInterceptorMetadata.valueType[1]['after'], AfterPredicateValueInterceptor);
        });

        it('after-value-type', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(mockEnumFactory.actual, 'after');

            const mockEnum = new Mock<Enum<ValueTypeData>>({
                allItem: {
                    10: {
                        value: 10
                    }
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build(mockAny),
                mockEnum.actual
            );

            const option = {
                value: {
                    valueType: 10
                }
            } as any;
            await self.handle(option);
            strictEqual(valueInterceptorMetadata.valueType[10]['after'], AfterValueTypeValueInterceptor);
        });

        it('before-predicate', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(mockEnumFactory.actual, 'before');

            const mockEnum = new Mock<Enum<ValueTypeData>>({
                allItem: {
                    1: {
                        value: 1
                    }
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build(mockAny),
                mockEnum.actual
            );

            const option = {
                value: {
                    valueType: 1
                }
            } as any;
            await self.handle(option);
            strictEqual(valueInterceptorMetadata.valueType[1]['before'], BeforePredicateValueInterceptor);
        });

        it('before-value-type', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(mockEnumFactory.actual, 'before');

            const mockEnum = new Mock<Enum<ValueTypeData>>({
                allItem: {
                    10: {
                        value: 10
                    }
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build(mockAny),
                mockEnum.actual
            );

            const option = {
                value: {
                    valueType: 10
                }
            } as any;
            await self.handle(option);
            strictEqual(valueInterceptorMetadata.valueType[10]['before'], BeforeValueTypeValueInterceptor);
        });

        it('skip', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(mockEnumFactory.actual, 'before');

            const mockEnum = new Mock<Enum<ValueTypeData>>({
                allItem: {
                    2: {
                        value: 2
                    }
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build(mockAny),
                mockEnum.actual
            );

            await self.handle({
                value: {
                    valueType: 2
                }
            } as any);
            strictEqual(valueInterceptorMetadata.valueType[2], undefined);
        });
    });
});