# Lodash

TODO: 未完待续，持续更新。

[博客主页 : https://hcthink.github.io/h-blog/](https://hcthink.github.io/h-blog/)

基础工具库代码解析

后文的 Lo 库, 代指 Lodash

---

## Lodash 源码阅读入口

[source code(完整版): 4.17.10](./lodash.js)

[source code(git版本): 4.17.10](./https://github.com/lodash/lodash)

[cur Version(分解版): 4.17.10](./Lodash-4.17.10.md)

---

## Lodash 基础框架结构

[Source](./Lodash-4.17.10.md)

---

## 设计 UN 库需要注意的细节:

### 1. 库'边界'处理 + undefined + root

避免污染参考: [underscore](../Underscore.js/readme.md)

this 获取方式参考: [lodash this](./demo/lodash-this.js)

```javascript
// jQuery: 一定能挂载到 window 上
(function () {
  var undefined;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  // 利用 Function 中的代码始终在全局域执行.
  var root = freeGlobal || freeSelf || Function('return this')();
}.call(this))
```

### 2.


### 3. 容错调用

3.1 类型转换容错

条件判断的类型: 确保条件判断始终在对 bool 值进行判断

```
error: if(a)
right: if(!!a)
```


3.2 基础操作调用容错

实际上用一个变量承接一个函数还有另一些作用. 比如避免调用出错,  怎么讲呢, 比如我们一般情况下调用一个基础操作, 比如 toString 时. 基本上都是对象点的方式.

```javascript
// eg:
obj.toString();

// 但是库种一般不能这么些, 因为这个 obj 往往是外界传入的.不能保证这个对象一定有 toString 操作, 或者是否被覆盖了, 如果没有这样将会报错. 所以一般的库都会采取这种写法
var toString = Object.prototype.toString;
toString.call(obj);

// 这样是非常稳妥的写法.
```

---

## 实现逻辑

[注: 必须选取主版本进行对比分析.]

1. noConflict. 参考: [noConflict demo](./demo/noConflict.js)

代码很简单.保留最初的 root._ 的引用. 当进入本库之后, root._ 被替换成当前库的引用.如果出现如下情况: 使用此方法

> __引用多个不同版本的 underscore.__

> __某个库也使用了 _ 作为简写方式挂载到宿主上.__

noConflict 方法可以释放对 _ 的引用.  并返回后加载的库.避免替换掉了同名引用库

jquery 也是如此. 但是 jquery 有两个引用: jQuery & $.

jquery 的 ready 函数建议写成 jQuery(function () {  // ...  })

[noconfig: http://www.cnblogs.com/laoyu/p/5189750.html](http://www.cnblogs.com/laoyu/p/5189750.html)

```javascript
//  最开始拿到初试引用
var previousUnderscore = root._;

// ...

_.noConflict = function() {
    // 在 noconf 中进行还原. 并返回当前库的引用
    root._ = previousUnderscore;
    // 存在问题, 原因是 noConflict 返回 this. 所以这里需要做一些语法绑定保证 this 不会被改变指向.
    // 可以考虑比如 bind(this)
    return this;
};
```

---

1. 函数(多为 iteratee)包装器createCallback 1.8 之后被替换为optimizeCb, 实现没有太大改变

> createCallback in v 1.7.0 / optimizeCb in v 1.8.0 +

```javascript
// Current version.
_.VERSION = '1.7.0';

// Internal function that returns an efficient (for current engines) version
// of the passed-in callback, to be repeatedly applied in other Underscore
// functions.
// 服务于 数组类数组 的扩充方法的 'cb(itaratee)' 的函数优化,用于指定 context, 并返回多种入参函数
// 这个函数逻辑没有复杂的地方, 整体是一个函数执行器
var createCallback/*optimizeCb // replace with optimizeCb in v1.8 */
= function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
        case 1: return function(value) {
           return func.call(context, value);
        };
        case 2: return function(value, other) {
            return func.call(context, value, other);
        };
        case 3: return function(value, index, collection) {
            return func.call(context, value, index, collection);
        };
        case 4: return function(accumulator, value, index, collection) {
            // 应对 reduce 的 iteratee(memo, obj[currentKey], currentKey, obj);
            return func.call(context, accumulator, value, index, collection);
        };
    }
    return function() {
        return func.apply(context, arguments);
    };
};
```

---

3. 一个比较有用的 is 系列方法实现: 如下的 is 事件的 toString 格式有一致表现,所以能归成一种实现.比较巧妙

> code: [is-fn code](./demo/is-fun.js)

```javascript
_.each([
    'Arguments',
    'Function',
    'String',
    'Number',
    'Date',
    'RegExp',
    'Error'
], function(name) {
    _['is' + name] = function(obj) {
        return toString.call(obj) === '[object ' + name + ']';
    };
});
```

---

## 参考
github:
> [https://github.com/lodash/lodash](https://github.com/lodash/lodash)

api:
> [https://lodash.com/docs/4.17.10](https://lodash.com/docs/4.17.10)


source desc:
> [http://www.css88.com/doc/underscore/docs/underscore.html#section-31](http://www.css88.com/doc/underscore/docs/underscore.html#section-31)
> [http://www.imooc.com/article/1566](http://www.imooc.com/article/1566)
> [noconfig: http://www.cnblogs.com/laoyu/p/5189750.html](http://www.cnblogs.com/laoyu/p/5189750.html)

---

## 声明

欢迎爱好技术的朋友一起讨论,技术不论高低,关键在于成长.^.^

如有错误欢迎讨论斧正.

**转载声明原文链接,  尊重博主. 感谢**

---

[博客主页 : https://hcthink.github.io/h-blog/](https://hcthink.github.io/h-blog/)
