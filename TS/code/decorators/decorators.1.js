var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var decorators;
(function (decorators) {
    function f() {
        console.log("f(): evaluated");
        return function (target, propertyKey, descriptor) {
            console.log("f(): called");
        };
    }
    function g() {
        console.log("g(): evaluated");
        return function (target, propertyKey, descriptor) {
            console.log("g(): called");
            console.log(target, propertyKey, descriptor);
        };
    }
    function h(target, propertyKey, descriptor) {
        console.log("h(): called");
    }
    var C = /** @class */ (function () {
        function C() {
        }
        // 直接提供对应装饰器
        // - 由上至下依次对装饰器表达式求值。
        // - 求值的结果会被当作函数，由下至上依次调用。
        C.method = function (a, b) {
            console.log("method(): called");
        };
        __decorate([
            h
            // 可传参
            ,
            f(),
            g()
        ], C, "method", null);
        return C;
    }());
    // f(g(method()));
    setTimeout(function () {
        // new C().method('C.method', 10);
        C.method('C.method', 10);
    }, 5000);
})(decorators || (decorators = {}));
