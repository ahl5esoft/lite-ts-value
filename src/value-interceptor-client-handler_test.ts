import { deepStrictEqual } from 'assert';

import { ValueInterceptorClientHandler } from './value-interceptor-client-handler';
import { IValueInterceptor } from './value-interceptor-handler-base';
import { ValueHandlerOption } from './value-handler-option';

class ValueInterceptorClient implements IValueInterceptor<any> {
    public async intercept(_: ValueHandlerOption) {
        return;
    }
}

describe('src/value-interceptor-client-handler.ts', () => {
    describe('.handle(option: ValueHandlerOption)', () => {
        it('after-predicate', async () => {
            const self = new ValueInterceptorClientHandler((value: true) => { return value; });
            const interceptClient = new ValueInterceptorClient();
            self.addObserver(1, interceptClient);
            await self.handle({
                value: {
                    valueType: 1
                }
            } as any);
            const metadata = Reflect.get(self, 'm_Metadata');
            deepStrictEqual(metadata, {
                '1': [interceptClient]
            });
            self.removeObserver(interceptClient, 1);
            deepStrictEqual(metadata, {
                '1': []
            });
        });
    });
});