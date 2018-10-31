'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var decorators;
(function (decorators) {
    // @ts-ignore
    var requiredMetadataKey = Symbol("required");
    var Greeter = /** @class */ (function () {
        function Greeter(message) {
            this.greeting = message;
        }
        Greeter.prototype.fn = function () { };
        Greeter.prototype.greet = function (p1, p2, p3, name, p5) {
            // loc 仅仅用于占位， 用来测试 required 的第三个参数。
            return "Hello " + name + ", " + this.greeting;
        };
        __decorate([
            validate,
            __param(3, required),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object, Object, Object, String, Object]),
            __metadata("design:returntype", void 0)
        ], Greeter.prototype, "greet", null);
        return Greeter;
    }());
    // 属性装饰器优先级更高
    function required(target, propertyKey, parameterIndex) {
        // console.log(`method： ${<string>propertyKey}，第 ${parameterIndex + 1} 个参数。`);
        // 可能有多个 属性装饰器， 所以需要去 push 到已有队列中。
        var existingRequiredParameters = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
        existingRequiredParameters.push({
            index: parameterIndex,
            method: propertyKey,
            constructors: target.constructor,
        });
        debugger;
        Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
    }
    // 方法装饰器： greet 增强
    function validate(target, propertyName, descriptor) {
        var method = descriptor.value;
        descriptor.value = function () {
            var requiredParameters = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
            if (requiredParameters) {
                for (var _i = 0, requiredParameters_1 = requiredParameters; _i < requiredParameters_1.length; _i++) {
                    var _a = requiredParameters_1[_i], index = _a.index, method_1 = _a.method, constructors = _a.constructors;
                    if (index >= arguments.length || arguments[index] === undefined) {
                        // 只是为了说明问题， 实际上 method 并非直接挂在 class 上的。
                        // @ts-ignore
                        throw (constructors.name + "." + String(method_1) + "[ " + constructors.name + ".prototype." + String(method_1) + " ] \u7B2C " + (index + 1) + " \u4E2A\u53C2\u6570\u662F\u5FC5\u4F20\u53C2\u6570\uFF0C\u8BF7\u63D0\u4F9B\u3002");
                        // throw new Error("Missing required argument.");
                    }
                }
            }
            return method.apply(this, arguments);
        };
    }
    var greeter = new Greeter('greeter');
    // @ts-ignore
    console.log(greeter.greet());
})(decorators || (decorators = {}));
//# sourceMappingURL=decorators.5.js.map