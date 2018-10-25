namespace decorators {
    function f(): (...param) => void {
        console.log("f(): evaluated");
        return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
            console.log("f(): called");
        }
    }

    function g(): (...param) => void {
        console.log("g(): evaluated");
        return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
            console.log("g(): called");
            console.log(target, propertyKey, descriptor);
        }
    }

    function h(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("h(): called");
    }

    class C {
        // 直接提供对应装饰器
        // - 由上至下依次对装饰器表达式求值。
        // - 求值的结果会被当作函数，由下至上依次调用。
        @h
        // 可传参
        @f()
        @g()
        // 可以切换到 static 测试静态成员
        // static method(a: string, b: number): void {
        method(a: string, b: number): void {
            console.log("method(): called");
        }
    }

        // f(g(method()));

    setTimeout(() => {
        new C().method('C.method', 10);
        // C.method('C.method', 10);
    }, 5000);

}
