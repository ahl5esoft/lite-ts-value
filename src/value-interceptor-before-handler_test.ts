import { strictEqual } from 'assert';
import { Enum, EnumFactoryBase } from 'lite-ts-enum';
import { Mock, mockAny } from 'lite-ts-mock';

import { ValueInterceptorBeforeHandler as Self, valueInterceptorBeforeMetadata } from './value-interceptor-before-handler';
import { IValueInterceptor, ValueBeforeIntercept } from './value-interceptor-decorator';
import { ValueTypeData } from './value-type-data';

@ValueBeforeIntercept((data: ValueTypeData) => {
    return data.value == 1;
})
class BeforePredicateValueInterceptor implements IValueInterceptor<boolean> {
    public async intercept() {
        return true;
    }
}

@ValueBeforeIntercept(10)
class BeforeValueTypeValueInterceptor implements IValueInterceptor<boolean> {
    public async intercept() {
        return false;
    }
}

describe('src/service/value/value-interceptor-handler.ts', () => {
    describe('.handle(option: ValueHandlerOption)', () => {
        it('before-predicate', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(mockEnumFactory.actual);

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
            strictEqual(valueInterceptorBeforeMetadata.beforeValueType[1], BeforePredicateValueInterceptor);
        });

        it('before-value-type', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(mockEnumFactory.actual);

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
            strictEqual(valueInterceptorBeforeMetadata.beforeValueType[10], BeforeValueTypeValueInterceptor);
        });

        it('skip', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(mockEnumFactory.actual);

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

            await self.handle({
                value: {
                    valueType: 2
                }
            } as any);
            strictEqual(valueInterceptorBeforeMetadata.beforeValueType[2], undefined);
        });
    });
});