// 运行命令： tsc --strictPropertyInitialization update.1.ts --strictNullChecks
var C = /** @class */ (function () {
    // 显式赋值断言
    // baz!: boolean;
    //  ~~~
    //  Error! Property 'baz' has no initializer and is not assigned directly in the constructor.
    function C() {
        this.bar = "hello";
        this.foo = 42;
        this.initialize();
    }
    C.prototype.initialize = function () {
        this.baz = true;
    };
    return C;
}());
console.log(new C());
