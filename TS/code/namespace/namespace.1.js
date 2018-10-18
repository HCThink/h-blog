var n1;
(function (n1) {
    function fn() {
        return 'namespace.2.ts >> namespace: n1';
    }
    n1.fn = fn;
    ;
})(n1 || (n1 = {}));
var n2;
(function (n2) {
    var Vue = /** @class */ (function () {
        function Vue() {
        }
        return Vue;
    }());
    n2.Vue = Vue;
})(n2 || (n2 = {}));
/// <reference path="namespace.2.ts" />
/**
 * 这么写需要将多个文件编译到一个文件中： tsc --outFile namespace.1.js  namespace.1.ts
 * 然后  node namespace.1.js 执行。 否则两个文件没法建立联系。
 */
var n1;
(function (n1) {
    var x = 10;
    console.log(n1.fn());
    ;
})(n1 || (n1 = {}));
var n2;
(function (n2) {
    new n2.Vue();
    var Person = /** @class */ (function () {
        function Person(name, age) {
            this.name = name;
            this.age = age;
        }
        return Person;
    }());
    n2.Person = Person;
})(n2 || (n2 = {}));
// 同文件 多个 namespace 不通用
(function (n2) {
    // error： Cannot find name 'Person'.
    new n2.Person();
})(n2 || (n2 = {}));
