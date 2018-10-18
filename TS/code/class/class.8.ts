/**
 * 多态： 看名字就知道这部分有多吊了吧
 */
namespace extendType {
    class A {
        prop: string = 'A';
        fn1(): void {
            console.log(this.prop);
        }
    }

    class B extends A {
        prop: string = 'B';
        fn1(): void {
            console.log(this.prop);
        }
        fn2(): void {
            console.log(this.prop);
        }
    }

    const obj: A = new B();
    /**
     * 讲子类实例赋值给父类类型，得到的对象以父类为规范，以子类实现为行为
     * 基本上就是多态的一个基本变现。
     * 实际上 obj 是 B 的实例，B 里声明了 fn2 函数， 但是 obj 却没法调用
     * 这个函数，因为承接 obj 的类型是 A， A 的声明里并没有 fn2.
     *
     * 利用这个特性，配合接口和抽象类基本上能够完成非常好的抽象约束能力。
     * 参考： /code/polymorphism/ 下的具体项目。
     */
    obj.fn2();      // error Property 'fn2' does not exist on type 'A'.
}
