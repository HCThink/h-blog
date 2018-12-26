
# cps thunk

- [1. callback](../callback/readme.md)
- [2. cps thunk](./readme.md)
- [3. defer / promise(非 es6)]
- [4. promise(ES6)]
- [5. generator -> co.]
- [6. async / await]

- 事件监听
- 订阅发布模型


# cps

> CPS 变换又叫做 continuation Passing Style，它是一种编程风格,用来将内部要执行的逻辑封装到一个闭包里面,然后再返回给调用者,这就将它的程序流程显式的暴露给了程序员,让我们可以控制它。


## cps is javascript

简单来讲如下代码：

```js
function id(x) {
  return x ;
}
```

in continuation-passing style:

```js
function id(x,cc) {
  cc(x) ;
}
```


## cps 处理异步

实际上对于 non-blocking programming 来讲，异步处理不借用回调配合事件机制，基本上很难完成异步处理, 正常非阻塞代码是不能在调用异步操作的时候直接得到一个有效结果（这也就是 promise 解决的问题）。所以我们必须实用一个 callback 在一个异步完成的时候执行一些后续操作。

这样的例子不可胜数，比如 ajax， 比如 node 的所有 io 异步 api【node 高版本已经给大部分 io 操作提供了 promise api, 之前说的 node 设计缺陷得以印证】。

```js
fs.readFile('/etc/passwd', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// fsPromises.readFile(path[, options])
```

node 中 io 相关的 api 在设计上是一种有格式的 cps 扩展， 你可能注意到了，node 异步 api 的最后一个参数总是一个 cb，用来接收异步操作的执行结果。

但实际上也有一些区别，原因是这里的 cb 并不承担延迟执行的作用，而是配合 node api 的 event 机制，在类似 `stream.Readable` 的 `end` 事件中, 触发注册的事件 （`emitter.emit(eventName[, ...args])`： 按照监听器注册的顺序，同步地调用每个注册到名为 eventName 的事件的监听器，并传入提供的参数。）



## cps 和 generator

如果我们需要实现协程,需要挂起某一个协程，然后需要的时候再执行这个协程。这样我们就需要将要挂起之后执行的逻辑包装起成一个 continuation,当需要的时候再执行这个 continuation。




---




# thunk

- thunk 依赖函数 CPS 化；
- thunk 执行后一般返回 thunk 化函数，形成链式调用；
- thunk 自身执行完毕后，结果进入 callback 运行；
- callback 的返回值如果是 thunk 函数，递归此过程；


## 花絮

Thunk函数诞生于上个世纪, 计算机学家在写编译器的时候，一个争论的焦点是"求值策略"，即函数的参数到底应该何时求值[请注意区分，这里说的不是值传递和引用传递的问题。]

如下代码中 squ 的实参 n + 1，应该在何时求值？

```js
let n = 10;

const squ = (a) => a ** 2

squ(n + 1);
```

大致思路两种

1. call by value

调用函数时就计算表达式，将结果给到函数， 等价于 squ(11); 这种方式相对简单明了，编译器可做代码优化。

2. call by name

大致理解为'惰性求值/延迟求值'。延迟求值过程，对特定场景可减少主调函数的计算压力（参数非常复杂的情况）。

大部分语言采用方案 1， 比如 js ，c。针对方案二的实现上，一种思路就是 thunk


## thunk 处理 延迟求值

> 思路：将参数表达式替换为一个 thunk 函数，但有个前提： squ 需要 cps 化。

1. cps 化

```js
const squ = (arg1) => arg1() ** 2

// cps：a(n) => n  转换为 a(n, fn) => fn(n)
const getArg = (n, fn) => fn(n);

let n = 10;
const re = squ(getArg.bind(null, n, (n) => n + 1));
```


2. thunk 化

```js
const squ = (arg1) => arg1() ** 2
const getArg = (n, fn) => fn(n);
const getArgThunk = thunkIfy(getArg);

function thunkIfy(getArg) {
    return (n) => {
        return (fn) => () => getArg(n, fn);
    }
}

let n = 10;
const re = squ(getArgThunk(n)(() => n + 1));
```

- [完整代码参考](./code/thunk.1.js)


## js/node 中的 thunk

### 处理回调问题

- [异步处理上，回调和 thunk 处理代码参考](./code/thunk.2.js)

实际上单独的 thunk 处理异步问题，还是比较费劲，要做链式调用，要管理多个异步执行顺序和依赖，要处理异常，会发现做着做着，就成 promise 的 polyfill, 源码分析参考：

- [es6-promise 源码分析](../../../source/promise/readme.md)

### node 中的 thunk

node 中的所有 io 操作的异步函数 都按照 cps 范式设计，形如： `fn(arg1, arg2, ..., (error, data) => {})` , 最后一个参数都是 cb，这个 cb 用于接受 error 和正确的 data。不考虑10+版本对每个 io 操作 promise 化。

node 异步 api 设计范式上高度一致，所以我们对其 thunk 化，非常简单而统一。 thunk 化 node 的过程就是将：
`fs.readFile('package.json', 'utf8', (err, str) => { })` 转化为 `fs.readFileThunk(file, options)(cb)` .

```js
var thunkify = require('thunkify');
var fs = require('fs');

// base
fs.readFile('package.json', 'utf8', function(err, str) {
  // doing ....
})

// thunk
var read = thunkify(fs.readFile);
read('package.json', 'utf8')(function(err, str){
    // doing ....
});
```



## thunkify 源码

1. [tj/node-thunkify](../../../source/node-thunkify/readme.md)

2. [thunks](../../../source/thunks/readme.md)


## thunk 应用

实际上要合理看待 thunk 的作用， 原因是他依赖函数 cps 化， 并且是一个函数转化的中间态，通常用于将多参数函数转化为单参数，用于计算机科学，或者一些函数的数学化验证。

- 逻辑延迟
- 执行器，流程控制器【场景特殊： generator】

### thunk + generator => co3-

- [TJ/Co 库源码分析（generator + thunk， generator + promise）](../../../source/co/readme.md)

### thunk 用于 promise

```js
// cps
fn(a, cb);

// thunk
fn(a)(cb);

// 形如 promise
fn(a).then(cb);
```

- [es6-promise 源码分析](../../../source/promise/readme.md)



## 友链

- https://github.com/thunks/thunks/blob/master/docs/api-zh.md
- http://www.ruanyifeng.com/blog/2015/05/thunk.html
