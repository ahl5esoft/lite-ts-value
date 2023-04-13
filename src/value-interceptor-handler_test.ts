import { ValueInterceptorHandlerBase } from './value-interceptor-handler-base';

class Self extends ValueInterceptorHandlerBase {
    protected async intercept() { }
}

describe('src/service/value/value-interceptor-handler.ts', () => {
    describe('.handle(option: ValueHandlerOption)', () => {
        it('ok', async () => {
            const self = new Self(null, null);
            Reflect.set(self, 'intercept', () => {
            });
            await self.handle({} as any);
        });
    });
});