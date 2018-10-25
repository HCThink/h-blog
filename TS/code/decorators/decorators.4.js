'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var decorators;
(function (decorators) {
    // @ts-ignore
    var formatMetadataKey = Symbol("format");
    var format;
    (function (format) {
        format[format["toUpperCase"] = 0] = "toUpperCase";
        format[format["toLowerCase"] = 1] = "toLowerCase";
        format[format["toLocaleUpperCase"] = 2] = "toLocaleUpperCase";
        format[format["toLocaleLowerCase"] = 3] = "toLocaleLowerCase";
    })(format || (format = {}));
    /**
     * 当 @format("Hello, %s")被调用时，它添加一条这个属性的元数据，通过reflect-metadata库里的Reflect.metadata函数。
     * 当 getFormat被调用时，它读取格式的元数据。
     */
    var Greeter = /** @class */ (function () {
        function Greeter(message) {
            this.greeting = message;
        }
        Greeter.prototype.greet = function () {
            var formatType = getFormat(this, "greeting");
            return format[formatType] + ": " + this.greeting[format[formatType] || 0]();
        };
        __decorate([
            Reflect.metadata(formatMetadataKey, format.toLocaleUpperCase)
        ], Greeter.prototype, "greeting", void 0);
        return Greeter;
    }());
    function getFormat(target, propertyKey) {
        console.log(target, propertyKey);
        return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
    }
    var greeter = new Greeter('Greeter');
    console.log(greeter.greet());
})(decorators || (decorators = {}));
