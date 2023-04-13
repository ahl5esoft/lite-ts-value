import { strictEqual } from 'assert';
import { Enum, EnumFactoryBase } from 'lite-ts-enum';
import { Mock, mockAny } from 'lite-ts-mock';

import { ValueInterceptorAfterHandler as Self, valueInterceptorAfterMetadata } from './value-interceptor-after-handler';
import { IValueInterceptor, ValueAfterIntercept } from './value-interceptor-decorator';
import { ValueTypeData } from './value-type-data';

@ValueAfterIntercept((data: ValueTypeData) => {
    return data.value == 1;
})
class AfterPredicateValueInterceptor implements IValueInterceptor<void> {
    public async intercept() {
        return;
    }
}

@ValueAfterIntercept(10)
class AfterValueTypeValueInterceptor implements IValueInterceptor<void> {
    public async intercept() {
        return;
    }
}

describe('src/service/value/value-interceptor-handler.ts', () => {
    describe('.handle(option: ValueHandlerOption)', () => {
        it('after-predicate', async () => {
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
                r => r.build(mockAny),
                mockEnum.actual
            );

            const option = {
                value: {
                    valueType: 1
                }
            } as any;
            await self.handle(option);
            strictEqual(valueInterceptorAfterMetadata.afterValueType[1], AfterPredicateValueInterceptor);
        });

        it('after-value-type', async () => {
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
                r => r.build(mockAny),
                mockEnum.actual
            );

            const option = {
                value: {
                    valueType: 10
                }
            } as any;
            await self.handle(option);
            strictEqual(valueInterceptorAfterMetadata.afterValueType[10], AfterValueTypeValueInterceptor);
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
                r => r.build(mockAny),
                mockEnum.actual
            );

            await self.handle({
                value: {
                    valueType: 2
                }
            } as any);
            strictEqual(valueInterceptorAfterMetadata.afterValueType[2], undefined);
        });
    });
});