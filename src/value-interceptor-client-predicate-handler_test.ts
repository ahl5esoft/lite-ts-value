import { deepStrictEqual } from 'assert';
import { Enum, EnumFactoryBase } from 'lite-ts-enum';
import { Mock, mockAny } from 'lite-ts-mock';

import { IValueObserver } from './i-value-observer';
import { ValueHandlerOption } from './value-handler-option';
import { ValueInterceptorClientPredicateHandler } from './value-interceptor-client-predicate-handler';
import { ValueTypeData } from './value-type-data';

class ValueInterceptorClientPredicate implements IValueObserver {
    public async notify(_: ValueHandlerOption) {
        return;
    }
}

describe('src/value-interceptor-client-predicate-handler.ts', () => {
    describe('.handle(option: ValueHandlerOption)', () => {
        it('interceptor-client-predicate', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new ValueInterceptorClientPredicateHandler((value: true) => { return value; }, mockEnumFactory.actual);
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
            const predicate = (valueType: ValueTypeData) => { return valueType.value == 1; };
            self.addObserver(predicate, interceptClient);
            await self.handle({
                value: {
                    valueType: 1
                }
            } as any);
            deepStrictEqual(Reflect.get(self, 'm_Observer'), [{
                ctor: interceptClient,
                predicate
            }]);
            self.removeObserver(interceptClient);
            deepStrictEqual(Reflect.get(self, 'm_Observer'), []);
        });
    });
});