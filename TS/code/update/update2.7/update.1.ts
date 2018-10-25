// 运行命令： tsc --strictPropertyInitialization update.1.ts --strictNullChecks
class C {
    foo: number;
    bar = "hello";
    baz: boolean;
    // 显式赋值断言
    // baz!: boolean;

    //  ~~~
    //  Error! Property 'baz' has no initializer and is not assigned directly in the constructor.
    constructor() {
        this.foo = 42;
        this.initialize();
    }


    initialize() {
        this.baz = true;
    }
}

console.log(new C());
