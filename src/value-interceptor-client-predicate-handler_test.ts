import { deepStrictEqual } from 'assert';
import { Enum, EnumFactoryBase } from 'lite-ts-enum';
import { Mock, mockAny } from 'lite-ts-mock';

import { ValueHandlerOption } from './value-handler-option';
import { ValueInterceptorClientPredicateHandler } from './value-interceptor-client-predicate-handler';
import { IValueInterceptor } from './value-interceptor-handler-base';
import { ValueTypeData } from './value-type-data';

class ValueInterceptorClientPredicate implements IValueInterceptor<any> {
    public async intercept(_: ValueHandlerOption) {
        return;
    }
}

describe('src/value-interceptor-client-predicate-handler.ts', () => {
    describe('.handle(option: ValueHandlerOption)', () => {
        it('after-predicate', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new ValueInterceptorClientPredicateHandler(mockEnumFactory.actual);
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

            const interceptClient = new ValueInterceptorClientPredicate();
            const predicates = (valueType: ValueTypeData) => { return valueType.value == 1; };
            self.addObserver(predicates, interceptClient);
            await self.handle({
                value: {
                    valueType: 1
                }
            } as any);
            deepStrictEqual(Reflect.get(self, 'm_Metadata'), [{
                ctor: interceptClient,
                predicates
            }]);
            self.removeObserver(interceptClient);
            deepStrictEqual(Reflect.get(self, 'm_Metadata'), []);
        });
    });
});