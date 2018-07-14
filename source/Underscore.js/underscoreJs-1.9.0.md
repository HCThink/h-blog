## 源码阅读

> lib           :       underscore

> version       :       v 1.9.0

> reader        :       hooper

> time          :       2017-08-22 14:14:36

> homepage      :       [https://hcthink.github.io/HBook/](https://hcthink.github.io/HBook/)

> code source   :       [https://github.com/jashkenas/underscore/blob/v1.9.0/underscore.js](https://github.com/jashkenas/underscore/blob/v1.9.0/underscore.js)

---

## 注:

> 直接提供对应版本源码进行分析, 如有 demo. 专门贴出

---

## 源码梳理

1. part 1: [Baseline setup + oop](#source)

2. part 2: [Collection Functions](./underscoreJs-1.9.0/Collection-function.md)

3. part 3: [Array Functions](./underscoreJs-1.9.0/Array-function.md)

4. part 4: [Function (ahem) Functions](./underscoreJs-1.9.0/Function-function.md)

5. part 5: [Object Functions](./underscoreJs-1.9.0/Object-function.md)

6. part 6: [Utility Functions](./underscoreJs-1.9.0/Utility-function.md)

---

## 源码部分测试

1. is-fun
> page test: [is-fun.html](./lib/is-fun.html).
> node test: [is-fun.js](./lib/is-fun.js).

---

## source
```javascript
//     Underscore.js 1.9.0
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

// 无传入方式的自调用块. 作用不多说, 避免污染全局. 没有传入或者 call 一个宿主.
(function() {
    // Baseline setup
    // --------------

    // Establish the root object, `window` (`self`) in the browser, or `global` on the server.
    // We use `self` instead of `window` for `WebWorker` support.
    /*
     * typeof self 在 node 的环境中可能不是一个安全操作. 但是因为有自执行函数包裹.不会影响外部
     *
     * 兼容处理浏览器和 node 环境.做了比较强的校验判断.其实没必要.宿主一定存在.
     * 宿主如果不存在也轮不到 js 执行报错.不过逻辑很严谨
     *
     * 为什么使用 self 而不用 window?
     *  在应用有frameset或者iframe的页面时，parent是父窗口，top是最顶级父窗口（有的窗口中套了好几层frameset或者iframe），self是当前窗口， opener是用open方法打开当前窗口的那个窗口。
     * 但事实上 window 适合 self 指向一致的窗口的.这块并不是特别理解
     *  用来支持WebWorker，在WebWorker里可以使用self但不能使用window.   // 2017-08-25 10:11:10 补充
     *
     * 宿主 window 是不可被覆盖的.但是 self 可被覆盖. 所以需要 self.self === self 这个条件
     */
    var root = typeof self === 'object' && self.self === self && self || typeof global === 'object' && global.global === global && global;

    // Save the previous value of the `_` variable.
    // 提供给 noConflict 作用参考: [underscore readme.md](./readme.md)
    var previousUnderscore = root._;


    /*  
        有一长段的代码去获取 js api 操作的引用, 数组对象的基础 api 引用.
        在支持的环境,可以用于校验传入的对象操作的合法性, 并利用该操作完成作业
            if (nativeReduce && obj.reduce === nativeReduce) {
                if (context) iterator = _.bind(iterator, context);
                return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
            }
        别忘了他的另一个作用: 可压缩性
    */
    // Save bytes in the minified (but not gzipped) version:
    var ArrayProto = Array.prototype,
        ObjProto = Object.prototype;

    // Create quick reference variables for speed access to core prototypes.
    var push = ArrayProto.push,
        slice = ArrayProto.slice,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;

    // All **ECMAScript 5** native function implementations that we hope to use
    // are declared here.
    var nativeIsArray = Array.isArray,
        nativeKeys = Object.keys,
        nativeCreate = Object.create;

    // Naked function reference for surrogate-prototype-swapping.
    // 用于 baseCreate 方法, 是一个承接 prototype 的中间件. 是 Object.create 的 polyfill.
    // baseCreate 中有详细介绍
    var Ctor = function() {};

    // Create a safe reference to the Underscore object for use below.
    // TODO
    /**
     * 1. 为什么很多库的入口设计成函数?
     *   设计成函数可以有多种调用方式: _.xxx , _().xxx, 前端库使用上往往偏向直接使用, 尽管内部为了做属性隔离也是使用 new. 但是并不会直接这么做.
     * 2. 上面的设计带来一个问题: 需要分别给 _ 和 _.prototype 进行赋值操作.
     *  大多数库会选择使用用一个 functions 之类的函数获取所有函数, 然后批量复制到原型上.
     *  毕竟每个函数都要赋值给 _ 和 _.prototype 会增大库的体积
     *  参考: mixin
     * 3. 由于2, 导致挂载在 _ 上的函数往往需要考虑兼容调用者.这使得 this 的使用变得谨慎, 可以看到
     *  un 库的大多数操作和 cd 都指定了明确的 context
     *
     * 如果把函数入口设计成函数, 在调用上更加友好, 但是函数需要兼容更多的情况. 大致的使用情况分为这样几种.
     *  1. 直接调用. 比如 _(obj), 如果这个 obj 是一个 un 对象, 则会直接返回, 
     *  如果传入的 obj 不是, 将它想办法挂载到 un 对象上, 最直接的做法就是: new _(obj), 以得到一个 un 对象
     *  2. new _(obj), 则直接挂载到 this 上.
     * 
     * 如下代码就较好的处理的 库 入口问题. 
     * 
     * 衍生的一个思路是处理了 一个有 this 的函数如何防止直接调用导致 this '泄露' 的问题.
     */
    var _ = function(obj) {
        if (obj instanceof _)
            return obj;
        if (!(this instanceof _))
            return new _(obj);
        this._wrapped = obj;
    };

    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for their old module API. If we're in
    // the browser, add `_` as a global object.
    /*
        node 环境, 和 browser 的兼容.
        优化点是:  node 环境, 如果 export 了 _, 则不会将 _ 同时挂载到宿主上
     */
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    }

    // Current version.
    _.VERSION = '1.9.0';

    // Internal function that returns an efficient (for current engines) version
    // of the passed-in callback, to be repeatedly applied in other Underscore
    // functions.
    // 参考: readme.md : 中对 optimizeCb 的说明 
    // 函数执行器.  
    var optimizeCb = function(func, context, argCount) {
        if (context === void 0)
            return func;
        switch (argCount == null
            ? 3
            : argCount) {
            case 1:
                return function(value) {
                    return func.call(context, value);
                };
            case 2:
                return function(value, other) {
                    return func.call(context, value, other);
                };
            case 3:
                return function(value, index, collection) {
                    return func.call(context, value, index, collection);
                };
            case 4:
                return function(accumulator, value, index, collection) {
                    return func.call(context, accumulator, value, index, collection);
                };
        }
        return function() {
            return func.apply(context, arguments);
        };
    };

    // A mostly-internal function to generate callbacks that can be applied
    // to each element in a collection, returning the desired result — either
    // identity, an arbitrary callback, a property matcher, or a property accessor.
    var cb = function(value, context, argCount) {
        // 兼容 null 和 undefined . 所以用 ==
        if (value == null)
            return _.identity;
        if (_.isFunction(value))
            return optimizeCb(value, context, argCount);
        if (_.isObject(value))
            return _.matcher(value);
        return _.property(value);
    };
    _.iteratee = function(value, context) {
        return cb(value, context, Infinity);
    };

    // Similar to ES6's rest param (http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html)
    // This accumulates the arguments passed into an array, after a given index.
    /*
        模拟剩余参数
    */    
    var restArgs = function(func, startIndex) {
        startIndex = startIndex == null
            ? func.length - 1
            : + startIndex;
        return function() {
            var length = Math.max(arguments.length - startIndex, 0);
            var rest = Array(length);
            var index;
            for (index = 0; index < length; index++) {
                rest[index] = arguments[index + startIndex];
            }
            switch (startIndex) {
                case 0:
                    return func.call(this, rest);
                case 1:
                    return func.call(this, arguments[0], rest);
                case 2:
                    return func.call(this, arguments[0], arguments[1], rest);
            }
            var args = Array(startIndex + 1);
            for (index = 0; index < startIndex; index++) {
                args[index] = arguments[index];
            }
            args[startIndex] = rest;
            return func.apply(this, args);
        };
    };

    // An internal function for creating a new object that inherits from another.
    /**
     * 思路: 借助一个中间件函数承接 prototype. 然后返回这个中间件实例, 之后再重置 prototype.简版继承   
     * 也可以借鉴 Object.create 的 polyfill. 他利用了对象的 __proto__ 属性引用了对象的原型这一特性
     * 这样不必维护一个空函数,并且维护函数的原型.
     * 缺点是: __proto__ 的支持度有些问题.
     *      api: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create
            Object.create = function (proto, propertiesObject) {
                if (!(proto === null || typeof proto === "object" || typeof proto === "function")) {
                    throw TypeError('Argument must be an object, or null');
                }
                var temp = new Object();
                temp.__proto__ = proto;
                if(typeof propertiesObject ==="object")
                    Object.defineProperties(temp,propertiesObject);
                return temp;
            };
     */
    var baseCreate = function(prototype) {
        if (!_.isObject(prototype))
            return {};
        if (nativeCreate)
            return nativeCreate(prototype);
        Ctor.prototype = prototype;
        var result = new Ctor;
        Ctor.prototype = null;
        return result;
    };

    var property = function(key) {
        return function(obj) {
            return obj == null
                ? void 0
                : obj[key];
        };
    };

    // Helper for collection methods to determine whether a collection
    // should be iterated as an array or as an object
    // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
    // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
    // 类数组对象判断
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var getLength = property('length');
    var isArrayLike = function(collection) {
        var length = getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };


    // Collection Functions
    // --------------------

    // 参考: ## Collection Functions
    // link: ./underscoreJs-1.9.0/Collection-function.md


    // Array Functions
    // ---------------

    // 参考: ## Array Functions
    // link: ./underscoreJs-1.9.0/Array-function.md


    // Function (ahem) Functions
    // ------------------

    // 参考: ## Function Functions
    // link: ./underscoreJs-1.9.0/Function-function.md


    // Object Functions
    // ----------------

    // 参考: ## Object Functions
    // link: ./underscoreJs-1.9.0/Object-function.md


    // Utility Functions
    // -----------------

    // 参考: ## Utility Functions
    // link: ./underscoreJs-1.9.0/Utility-function.md


    // OOP
    // ---------------
    // If Underscore is called as a function, it returns a wrapped object that
    // can be used OO-style. This wrapper holds altered versions of all the
    // underscore functions. Wrapped objects may be chained.

    // Helper function to continue chaining intermediate results.
    var chainResult = function(instance, obj) {
        return instance._chain
            ? _(obj).chain()
            : obj;
    };

    // Add your own custom functions to the Underscore object.
    /**
     * 将所有的静态操作同步到原型上. 并且做了包装. 添加了链式操作. 实际上这里开了一个切面
     */
    _.mixin = function(obj) {
        /*
         *  _.functions
         *      loc: ./underscoreJs-1.9.0/Object-function.md
         *      desc: 返回一个对象的所有函数名的集合.
         */
        _.each(_.functions(obj), function(name) {
            // TODO _[name] = obj[name] 这一步覆盖有必要么? 我在想
            // 其实并没有覆盖. 而是说如果传入的 obj 有新的操作会同步到 _ 上, 恰巧这里的后面 _.mixin(_); 传入的也是 _ 本身
            var func = _[name] = obj[name];
            // 给原型依次赋值.但是做了包装.
            _.prototype[name] = function() {
                // TODO
                var args = [this._wrapped];
                push.apply(args, arguments);
                return chainResult(this, func.apply(_, args));
            };
        });
    };

    // Add all of the Underscore functions to the wrapper object.
    // 关键操作,将[_]上的函数进行迁移
    _.mixin(_);

    // Add all mutator Array functions to the wrapper.
    _.each([
        'pop',
        'push',
        'reverse',
        'shift',
        'sort',
        'splice',
        'unshift'
    ], function(name) {
        var method = ArrayProto[name];
        _.prototype[name] = function() {
            var obj = this._wrapped;
            method.apply(obj, arguments);
            if ((name === 'shift' || name === 'splice') && obj.length === 0)
                delete obj[0];
            return chainResult(this, obj);
        };
    });

    // Add all accessor Array functions to the wrapper.
    _.each([
        'concat', 'join', 'slice'
    ], function(name) {
        var method = ArrayProto[name];
        _.prototype[name] = function() {
            return chainResult(this, method.apply(this._wrapped, arguments));
        };
    });

    // Extracts the result from a wrapped and chained object.
    _.prototype.value = function() {
        return this._wrapped;
    };

    // Provide unwrapping proxy for some methods used in engine operations
    // such as arithmetic and JSON stringification.
    _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

    _.prototype.toString = function() {
        return '' + this._wrapped;
    };

    // AMD registration happens at the end for compatibility with AMD loaders
    // that may not enforce next-turn semantics on modules. Even though general
    // practice for AMD registration is to be anonymous, underscore registers
    // as a named module because, like jQuery, it is a base library that is
    // popular enough to be bundled in a third party lib, but not be part of
    // an AMD load request. Those cases could generate an error when an
    // anonymous define() is called outside of a loader request.
    if (typeof define === 'function' && define.amd) {
        define('underscore', [], function() {
            return _;
        });
    }
}());
```
