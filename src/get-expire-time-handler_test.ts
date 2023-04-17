class A {
    public list: number[] = [];
}

class B extends A { }

class C extends A { }

describe('src/get-expire-time-handler.ts', () => {
    describe('.handling(option: ValueHandlerOption, time: Time)', () => {
        it('greater than', async () => {
            const b = new B();
            const c = new C();
            b.list.push(1, 2, 3, 4);
            c.list.push(5, 6, 7, 8);
            console.log(b.list);
            console.log(c.list);
        });
    });
});