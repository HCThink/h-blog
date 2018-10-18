class A {
    p1: string = 'A';
    fn1(): void {}
}

class B {
    p1: any = 1;
    fn1(): any {}
    fn2(): void {}
}

/**
 * 没有继承关系的多态。
 * TypeScript 使用的是结构性类型系统。 当我们比较两种不同的类型时，并不在乎它们从何处而来，
 * 如果所有成员的类型都是兼容的，我们就认为它们的类型是兼容的。
 */
const f: A = new B();

console.log(typeof f.p1);
// error
console.log(f.fn2);
