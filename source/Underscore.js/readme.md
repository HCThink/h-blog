# underscore

[博客主页 : https://hcthink.github.io/h-blog/](https://hcthink.github.io/h-blog/)

基础工具库代码解析

后文的 UN 库, 代指 underscore

---

## underscore 源码阅读入口

时间问题,只挑大版本进行阅读

[last Version : 1.9.0](./underscoreJs-1.9.0.md)

> 库相对简单, 暂时不做太详细解析. 待补充 

[mid Version : 1.5.0](./underscoreJs-1.5.0.md)

[low Version : 0.5.0](./underscoreJs-0.5.0.md)

---

## underscore 基础框架结构

[Source](./underscoreJs-1.9.0.md#Source)

---

## 设计 UN 库需要注意的细节:

### 1. 避免污染全局变量

最常见的就是用一个自调用形成闭包

```javascript
// jQuery: 一定能挂载到 window 上
(function (root, undefined) {
    .....
})(window)
```

```javascript
// underscop: [兼容 web 和 node, this 可以是 global
// 此方式存在问题, 在严格模式下 全局的 this 指向一个空对象. 不推荐参考
(function () {

}.bind(this)());
// }.call(this);

// 目前大多 underscore 都是这种, 可以兼容 web 和 node 等多种宿主环境
(function () {
    const root = this;
}())

// 或者 利用严格模式下级块作用域 (不能使用 var, 用 let 和 const 代替)
'use strict'
{
    // ....
}
```

### 2.  压缩体积
web 库必须考虑的一个问题就是 lib 的大小, web 库一般不能太影响网络传输.

比较常见的方式在于巧妙利用压缩策略.比如: 一般库都会传入一个 window. 一是性能考虑,避免过深的查询作用域, 另一考虑就在于传入 window 后,使用一个引用接受,这个引用可以被压缩为一个字母.

```javascript
(function (a, b) {
    // .....
})(window)
// 其他
var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

var
toString              = ObjProto.toString,
forEach               = ArrayProto.forEach,
propertyIsEnumerable  = Object.prototype.propertyIsEnumerable;
// ....

// Object.prototype.xxx 这种代码是不可压缩的，Object,prototype这些名字改了浏览器就不认得了。
// 但是上面的代码中创建了ObjProto之后，源生代码经过压缩之后，ObjProto就可能命名成 a 变量，那么原来的代码就压缩成 a.xxx

// 类似的还有:
var ArrayProto = Array.prototype, ObjProto = Object.prototype;

// 一个小建议就是凡事一段代码被使用两次以上都建议定义变量(函数)，有利于修改和压缩代码。
```


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

last. 我们通过对一些方法实现的变迁一窥 un 的进化史. 以 reduce(此方法不像max 等操作, 他存在兼容问题.会看到更多的思考在里面)  为例

> 跳过三位版本,确实太多了

> v 0.1.0 版本此方法命名为 inject[0.2即更名 reduce. 直到 0.3.2 实现并没有改变], 直接使用一个兼容的 each 操作.

```javascript
// v 0.1.0
inject : function(obj, memo, iterator, context) {
    _.each(obj, function(value, index) {
      memo = iterator.call(context, memo, value, index);
    });
    return memo;
}
```

> v 0.3.3 的版本中尝试在已经支持 reduce 的浏览器上利用系统提供的 reduce

```javascript
// v 0.3.3
if (obj && obj.reduce) return obj.reduce(_.bind(iterator, context), memo);    
```

> v 0.5.1 的版本中, 对 reduce 做了进一步的校验. 因为有可能出现恶作剧的情况. 对象的 reduce 并非一个函数

```javascript
// v0.5.1
if (obj && _.isFunction(obj.reduce)) return obj.reduce(_.bind(iterator, context), memo);
```

> v 0.6.0 - v 1.1.0 很明显 0.5 的校验策略还是不那么安全.

> 原因是 reduce 即便是函数, 也未必具有可信度.也有可能别的框架注入了一个 reduce 函数却并不是 underscore 中的 reduce 函数想要实现的功能.

> 于是乎 un 做了更严格的匹配. 使用 js Array 上扩展的 reduce 函数. 这是个更加可靠的选择. 当然这个操作可能是一些库的扩展.比如 jq

```javascript
// v 0.6.0 - v 1.1.0 .没有太大的变化
var nativeReduce = Array.prototype.reduce;
if (nativeReduce && obj.reduce === nativeReduce)
    // ....
```

> v 1.2.0 - 1.6.* 使用 ECMAScript 5 * 的 reduce 操作. 这方法在接受参数上和 jq 和原本 un 的实现有些差异. 所以在这里做了兼容

```javascript
// **Reduce** builds up a single result from a list of values, aka `inject`,
// or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
_.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = memo !== void 0;
    // v 1.3.0 判断 memo 参数逻辑
    //  var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    // ...
};
```

> 1.7 + 的版本中加了一个 createCallback 的概念.对大部分函数都做了一个切面处理.后面详述这个函数

> 1.7 + 去平行处理对象和数组.

```javascript
// **Reduce** builds up a single result from a list of values, aka `inject`,
// or `foldl`.
// 函数别称
_.reduce = _.foldl = _.inject = function(obj, iteratee, memo, context) {
    if (obj == null) obj = [];
    iteratee = createCallback(iteratee, context, 4);
    // 兼容 object 对象的迭代
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index = 0, currentKey;
    if (arguments.length < 3) {
        if (!length) throw new TypeError(reduceError);
        // 外部没有提供的时候,获取数组或者对象的第一个属性 作为 memo 的值
        memo = obj[keys ? keys[index++] : index++];
    }
    for (; index < length; index++) {
        // 平行处理数组和对象. for 是万能的.
        currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
};

// keys 的处理逻辑
_.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
};
```

> 1.8.* 中对相似逻辑的 reduce 和 reduceRight 做了一致化处理.

```javascript
// Create a reducing function iterating left or right.
function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
        // 比较巧妙的是利用 dir 作为增量.这个 dir 不仅承载了标识方向的作用. 还做了 step. 但是呢.这个 dir 的实际上应该设计成 [1, -1]的枚举序列,会比较 ok
        for (; index >= 0 && index < length; index += dir) {
            var currentKey = keys ? keys[index] : index;
            memo = iteratee(memo, obj[currentKey], currentKey, obj);
        }
        return memo;
    }

    return function(obj, iteratee, memo, context) {
        iteratee = optimizeCb(iteratee, context, 4);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length,
            index = dir > 0 ? 0 : length - 1;
        // Determine the initial value if none is provided.
        if (arguments.length < 3) {
            memo = obj[keys ? keys[index] : index];
            index += dir;
        }
        return iterator(obj, iteratee, memo, keys, index, length);
    };
}

var isArrayLike = function(collection) {
    var length = collection && collection.length;
    return typeof length == 'number' && length >= 0 && length <=  MAX_ARRAY_INDEX;
};

_.reduce = _.foldl = _.inject = createReduce(1);
_.reduceRight = _.foldr = createReduce(-1);
```

> 1.9.0 对1.8 的方案进行了优化, 将数据的格式化和数据准备放到了 reduce 了里面,提高了方法的原子性.

```javascript
var createReduce = function(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    var reducer = function(obj, iteratee, memo, initial) {
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length,
            index = dir > 0 ? 0 : length - 1;
        if (!initial) {
          memo = obj[keys ? keys[index] : index];
          index += dir;
        }
        for (; index >= 0 && index < length; index += dir) {
          var currentKey = keys ? keys[index] : index;
          memo = iteratee(memo, obj[currentKey], currentKey, obj);
        }
        return memo;
    };

    return function(obj, iteratee, memo, context) {
        var initial = arguments.length >= 3;
        return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
};
```

---

## 参考
github:
> [https://github.com/jashkenas/underscore](https://github.com/jashkenas/underscore)

api:
> [http://www.css88.com/doc/underscore/](http://www.css88.com/doc/underscore/)
> [http://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/001450370530539bc6e0e3dc02c4d3bb79993a8cde056b5000](http://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/001450370530539bc6e0e3dc02c4d3bb79993a8cde056b5000)

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
