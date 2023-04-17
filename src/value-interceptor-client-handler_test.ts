import { deepStrictEqual } from 'assert';

import { IValueObserver } from './i-value-observer';
import { ValueInterceptorClientHandler } from './value-interceptor-client-handler';
import { ValueHandlerOption } from './value-handler-option';

class ValueInterceptorClient implements IValueObserver {
    public async notify(_: ValueHandlerOption) {
        return;
    }
}

describe('src/value-interceptor-client-handler.ts', () => {
    describe('.handle(option: ValueHandlerOption)', () => {
        it('interceptor-client', async () => {
            const self = new ValueInterceptorClientHandler((value: true) => { return value; });
            const interceptClient = new ValueInterceptorClient();
            self.addObserver(1, interceptClient);
            await self.handle({
                value: {
                    valueType: 1
                }
            } as any);
            const metadata = Reflect.get(self, 'm_Observer');
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