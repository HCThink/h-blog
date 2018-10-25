'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var decorators;
(function (decorators) {
    function fnPlus(target, propertyKey, descriptor) {
        var oldFn = target[propertyKey];
        descriptor.value = function () {
            var param = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                param[_i] = arguments[_i];
            }
            console.log.apply(console, ['before fn deal:'].concat(param));
            var dealParam = oldFn.call.apply(oldFn, [target].concat(param));
            console.log('after fn deal:', dealParam);
        };
    }
    var Person = /** @class */ (function () {
        function Person() {
        }
        Person.prototype.fn = function (pa) {
            console.log('fn deal..');
            return pa;
        };
        __decorate([
            fnPlus
        ], Person.prototype, "fn", null);
        return Person;
    }());
    var lm = new Person();
    lm.fn('fn');
})(decorators || (decorators = {}));
