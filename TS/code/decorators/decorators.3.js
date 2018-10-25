'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var decorators;
(function (decorators) {
    let Greeter = class Greeter {
        constructor(message) {
            this.greeting = message;
        }
        greet() {
            return "Hello, " + this.greeting;
        }
    };
    Greeter = __decorate([
        sealed
    ], Greeter);
    function sealed(constructor) {
        console.log('非扩展类');
        // @ts-ignore
        constructor.readme = '静态属性';
        constructor.prototype.readme = () => '实例属性';
        Object.seal(constructor);
        Object.seal(constructor.prototype);
        // 类装饰器表达式会在运行时当作函数被调用，类的构造函数作为其唯一的参数。
        // 如果类装饰器返回一个值，它会使用提供的构造函数来替换类的声明。
        // 注意  如果你要返回一个新的构造函数，你必须注意处理好原来的原型链。 在运行时的装饰器调用逻辑中 不会为你做这些。
        // 使用匿名类 + 继承可实现原型链维护和类型「回执」。
        return class extends Greeter {
            constructor(message, version = 'InnGreeter 1.0') {
                super(message);
                this.version = version;
                // return class InnGreeter extends Greeter{
                this.name = 'extends Greeter';
            }
        };
    }
    const greeter = new Greeter('greeter');
    // @ts-ignore
    console.log(Greeter.readme, greeter.readme());
    console.log(greeter, greeter instanceof Greeter, Greeter.prototype.constructor, Greeter.prototype.constructor === Greeter);
})(decorators || (decorators = {}));
