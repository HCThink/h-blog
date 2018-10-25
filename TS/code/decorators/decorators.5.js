'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
        Greeter.prototype.greet = function (loc, name) {
            // loc 仅仅用于占位， 用来测试 required 的第三个参数。
            return "Hello " + name + ", " + this.greeting;
        };
        __decorate([
            validate,
            __param(1, required)
        ], Greeter.prototype, "greet", null);
        return Greeter;
    }());
    // 属性装饰器优先级更高
    function required(target, propertyKey, parameterIndex) {
        console.log("method\uFF1A " + propertyKey + "\uFF0C\u7B2C " + parameterIndex + " \u4E2A\u53C2\u6570\u3002");
        var existingRequiredParameters = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
        existingRequiredParameters.push(parameterIndex);
        Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
    }
    // 方法装饰器： greet 增强
    function validate(target, propertyName, descriptor) {
        var method = descriptor.value;
        descriptor.value = function () {
            var requiredParameters = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
            if (requiredParameters) {
                for (var _i = 0, requiredParameters_1 = requiredParameters; _i < requiredParameters_1.length; _i++) {
                    var parameterIndex = requiredParameters_1[_i];
                    if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
                        throw new Error("Missing required argument.");
                    }
                }
            }
            return method.apply(this, arguments);
        };
    }
    var greeter = new Greeter('greeter');
    console.log(greeter.greet('', 'nice'));
})(decorators || (decorators = {}));
