# koa2

[koa homepage](https://koa.bootcss.com/)

> 优秀的下一代 web 开发框架。
> Koa 应用程序不是 HTTP 服务器的1对1展现。 可以将一个或多个 Koa 应用程序安装在一起以形成具有单个HTTP服务器的更大应用程序。



## 基础使用

### 快速搭建简易 koa server 服务

koa 搭建一个服务还是很简单的, 主要代码如下， 完整代码如下. 切到主目录下，

1. 安装依赖： `yarn`
2. 执行入口： `yarn start`

- [koa demo 目录](./code/koa/)
- [koa demo 主文件](./code/koa/app.js)


```javascript
import Koa from 'koa';
import https from 'https';
import open from 'open';

const Log = console.log;
const App = new Koa();

App.use(async (ctx, next) => {
    ctx.body = 'Hello World';
    Log('mid1 start...');
    await next();
    Log('mid1 end...');
});

App.use(async (ctx, next) => {
    debugger;
    Log('mid2 start...');
    await next();
    Log('mid2 end...');
});


App.use((ctx, next) => {
    Log('mid3...');
});

// 服务监听： 两种方式。
App.listen(3000);           // 语法糖
// http.createServer(app.callback()).listen(3000);
https.createServer(App.callback()).listen(3001);

open('http://localhost:3000');

// 如下为执行顺序， 实际上 http 会握手，所以输出多次
// 如下执行特征也就是洋葱圈， 实际上熟悉 async、await 则不会比较意外。
// mid1 start...
// mid2 start...
// mid3...
// mid2 end...
// mid1 end...
```


### koa2特性

- 封装并增强 node http server[request, response]，简单易容。
- 洋葱圈处理模型。
- 基于 async/await 的灵活强大的中间件机制。
- 通过委托使得 api 在使用上更加便捷易用。


### api

参考官网提供的基本 api ，不在赘述： https://koa.bootcss.com/

部分 api 实现，参考： [源码分析](#源码)


#### 常用 api

- app.listen: 服务端口监听
- app.callback: 返回适用于 http.createServer() 方法的回调函数来处理请求。你也可以使用此回调函数将 koa 应用程序挂载到 Connect/Express 应用程序中。
- app.use(function): 挂载中间件的主要方法。


#### 核心对象

> context

Koa Context 将 node 的 request 和 response 对象封装到单个对象中，为编写 Web 应用程序和 API 提供了许多有用的方法。 这些操作在 HTTP 服务器开发中频繁使用，它们被添加到此级别而不是更高级别的框架，这将强制中间件重新实现此通用功能。__每个__ 请求都将创建一个 Context，并在中间件中作为接收器引用，或者 ctx 标识符。

- ctx.res request
- ctx.req： response
- ctx.request： koa request tool
- ctx.response： koa response tool
- ctx.cookies

- ctx.request.accepts(types):  type 值可能是一个或多个 mime 类型的字符串，如 application/json，扩展名称如 json，或数组 ["json", "html", "text/plain"]。
- request.acceptsCharsets(charsets)

...

[更多参考](https://koa.bootcss.com/)



## 洋葱圈

### 使用层面

1. koa 洋葱圈执行机制图解

- ![middleware](../../resource/img/middleware.gif)
- [koa 洋葱圈](#基础使用)
- [koa demo](./code/koa/app.js), [koa demo 源码](./code/koa.zip)

2. 洋葱圈简易实现版

> 执行方式： `tsc onionRings.ts --lib 'es2015' --sourceMap && node onionRings.js`

- [洋葱圈简易实现版 main](./code/onionRings/onionRings.ts), [洋葱圈简易实现版 源码](./code/onionRings.zip)

- [简易实现 外部中间件](./code/onionRings/koa-readFile.ts)
- [参考： koa-bodyparser](https://github.com/koajs/bodyparser/blob/master/index.js)

> main code
```typescript
public use(middleware: Function) {
    this.middList.push(middleware);
}

// 执行器
private async deal(i: number = 0) {
    debugger;
    if (i >= this.middList.length) {
        return false;
    }
    await this.middList[i](this, this.deal.bind(this, i + 1));
}
```

### 实现思路

1. use 方法注册 middleware。
2. deal 模拟一个执行器: 大致思路就是将下一个 middleware 作为上一个 middleware 的 next 去 await，用以保证正确的执行顺序和中断。


### 问题

> 如果习惯了回调的思路， 你会不会有这种疑惑： 洋葱圈机制于在 一个中间件中调用另一个中间件，被调中间件执行成功，回到当前中间件继续往后执行，这样不断调用，中间件很多的话， 会不会形成一个很深的函数调用栈？ 从而影响性能， 同时形成「xx 地狱」？        -- ps（此问题源于分享时原同事 小龙 的提问。）

实际上这是个很好的问题，对函数执行机制比较了解才会产生的疑问。排除异步代码处理，我们很容易用同步方式模拟出这种调用层级。参考： [同步方式](./code/onionRings/callStack.js)。 这种模式存在明显的调用栈问题。

我可以负责任的回答： 不会的，下一个问题。 😂 😂

不会的原因在 generator 中详细介绍，一两句说不清楚。实际上我认为这里是有语法门槛的。在 generator 之前，用任何方式处理这个问题，都显得怪异，而且难以解调用决层级带来的性能, 调试等带来问题。

详细说明参考： [generator 真.协程](../../js/syncAndAsync/generator/readme.md#真协程)



## 源码

> KOA 源码特别精简, 不像 Express 封装的功能那么多, git 源码： 【https://github.com/koajs/koa】

### 工程

koa2 的源码工程结构非常简洁，一目了然, 没有花里胡哨的东西。

> 主文件
```
├── History.md
├── ....
├── Readme.md
├── benchmarks
├── docs                         // doc
│   ├── api ......
├── lib                          // 源码
│   ├── application.js           // 入口文件，封装了context，request，response，核心的中间件处理流程。
│   ├── context.js               // context.js 处理应用上下文，里面直接封装部分request.js和response.js的方法
│   ├── request.js               // request.js 处理http请求
│   └── response.js              // response.js 处理http响应
├── package.json
└── test                         // 测试模块
    ├── application
    ....
```

> package.json
1. jest 做测试
2. node 版本
    ```json
    {
        "engines": {
            "node": "^4.8.4 || ^6.10.1 || ^7.10.1 || >= 8.1.4"
        }
    }
    ```
3. 主入口： `"main": "lib/application.js"`


### koa 核心模块

- 封装的 http server（node）
- 核心对象 context, request、response
- 中间件机制和剥洋葱模型的实现
- 错误捕获和错误处理


### 源码

__所有源码分析均以「注释」的方式提供在如下源码文件中【私以为这么做相对好一些，有更好的方式欢迎告知】__

- [application.js](./koa2/lib/application.js)
  application.js 是 koa 的入口，继承了events , 所以框架有事件监听和事件触发的能力。application 还暴露了一些常用的api，比如toJSON、listen、use等等。
- [context.js](./koa2/lib/context.js)
- [request.js](./koa2/lib/request.js)
- [response.js](./koa2/lib/response.js)

### 特殊处理

#### 委托

- 摘自 context.js：[context.js](./koa2/lib/context.js)

```js
const proto = module.exports = {
    // ...
};

delegate(proto, 'response')
  .method('attachment')
  .method('redirect')
  .method('remove')
  .method('vary')
  .method('set')
  .method('append')
  .method('flushHeaders')
  .access('status')
  .access('message')
  .access('body')
  .access('length')
  .access('type')
  .access('lastModified')
  .access('etag')
  .getter('headerSent')
  .getter('writable');

delegate(proto, 'request')
  .method('acceptsLanguages')
  .method('acceptsEncodings')
  .method('acceptsCharsets')
  .method('accepts')
  .method('get')
  .method('is')
  .access('querystring')
  .access('idempotent')
  .access('socket')
  .access('search')
  .access('method')
  .access('query')
  .access('path')
  .access('url')
  .access('accept')
  .getter('origin')
  .getter('href')
  .getter('subdomains')
  .getter('protocol')
  .getter('host')
  .getter('hostname')
  .getter('URL')
  .getter('header')
  .getter('headers')
  .getter('secure')
  .getter('stale')
  .getter('fresh')
  .getter('ips')
  .getter('ip');
```

koa 为了方便串联中间件，提供了一个 context 对象，并且把核心的 response， request 对象挂载在上面， 但是这样往往就造成使用上写法冗余， eg： `ctx.response.body`, 而且某些对象还是经常使用的，这很不方便，所以产生了 delegates 库，用于委托操作, 委托之后，就可以在 ctx 上直接使用部分委托属性： `ctx.body`。源码分析如下

- [delegates 源码解析](../delegates/readme.md)
- [delegates 库源码文件](../delegates/index.js)


#### middleware 机制

[koa-compose](https://github.com/koajs/compose/blob/master/index.js)

koa 中 use 用来注册中间件，实际上是将多个中间件放入一个缓存队列中 `this.middleware.push(fn);`，然后通过koa-compose这个插件进行递归组合。

因此严格来讲 middleware 的执行结构的组织并不在 koa 源码中完成，而是在依赖库 `koa-compose` 中。 koa 中使用： `const fn = compose(this.middleware);` 完成中间件的组合。

koa-compose 核心逻辑如下， 主要思路大致是： 通过包装 middleware List 返回一个 组装好的执行器。
组装思路是：将下一个 middleware 进行包装【执行器 + promise 化】作为上一个 middleware 的 next【dispatch.bind(null, i + 1)】。同时给中间件提供 context 对象。

```js
return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)

    function dispatch (i) {
        if (i <= index)
            return Promise.reject(new Error('next() called multiple times'))
        index = i
        let fn = middleware[i]
        if (i === middleware.length) fn = next
        // 函数洋葱的最后补上一个Promise.resolve();
        if (!fn) return Promise.resolve()

        try {
            // middleware 是 async 函数， 返回 promise 。Promise.resolve 确保中间件执行完成
            // 提供 ctx， next fn: dispatch.bind(null, i + 1)
            return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
        } catch (err) {
            return Promise.reject(err)
        }
    }
}
```

> koa-compose

koa-compose 是一个非常精简的库，不做单独分析了， 他提供了一种主调型的递归: `fn(context, dispatch.bind(null, i + 1))` , 这种方式可以认为是'懒递归'， 将递归的执行交给主调者控制，这样能够在更合适的时机执行后续处理, 但如果某个中间件不调用 next，那么其后的中间件就不被执行了。这和 js 协程【generator】有机制上的类似，都是使用者来控制 next 的执行时机， 可类比学习。

- [generator](../../js/syncAndAsync/generator/readme.md)



#### 易用性处理

koa 非常易用， 原因是 koa 在源码层面做了大量的 委托 和针对复杂对象的封装，如 request, response 的 get/set. 用以提高工具的可用度，易用度。实际上我认为这一点是现代框架非常重要的东西，脱离用户的库都不是好库。koa 是好库。

- delegates 上面说过， 参考： [delegates](#委托)。
- get/set

request, response 两个文件千行代码， 80% 左右的都是 get、set，参考：

- [request.js](./koa2/lib/request.js)
- [response.js](./koa2/lib/response.js)

另一方面，表现在 [application.js](./koa2/lib/application.js) 的 `createContext` 方法中，通过挂载引用和委托配合 get set 的实践配合提升易用度，单独不太好讲，分析注释在源码中。


### 异常捕获

1. 中间件异常捕获， koa1 中间件基于 generator + co, koa2 中间件基于 async/await, async 函数返回 promise， 所以只要在组合中间件后 catch 即可捕获中间件异常
    `fnMiddleware(ctx).then(handleResponse).catch(onerror);`

2. 框架层发生错误的捕获机制, 这个通过继承 event 模块很容易实现监听。
   `this.on('error', this.onerror);`

   注册的 error 事件， 在 context.onerror 中被 emit `this.app.emit('error', err, this);`

3. http 异常处理 ： Execute a callback when a HTTP request closes, finishes, or errors.
   `onFinished(res, onerror); // application.handleRequest`


### 中间件交互

初用中间件可能会有一个疑问： 中间件如何通信？

事实上这是个设计取舍逻辑, 中间件之间的数据交互并不是麻烦事， 特别是在 ECMAScript 推出 async await 之后，但问题是这样做的意义不大，原因是所有的中间件是可任意插拔组合的，这种不确定性，导致了中间件之间的数据交互就变得不稳定，最起码的数据格式就没办法固定，就更别谈处理了。灵活的插件机制导致中间件之间的交互难有统一层面的实现。

另一方面从中间件的定位来看，其之间也没必要交互，中间件不能脱离 http 的请求响应而独立存在，他是服务于整个过程的，也因此所有的中间件第一个参数就是 ctx， 这个对象挂载了 request 和 response， 以及 koa 提供的封装和工具操作。



## 核心点

### 中断

这是洋葱圈非常核心的支撑点, 我们稍微留意就能发现 koa 中间件执行机制于普通 js 的执行顺序很不一致, 我们看如下代码：

```typescript
app.use(async (cxt, next) => {
    Log(1);
    await next();
    Log(2);
});

app.use(async (cxt, next) => {
    Log(3);
    await next();
    Log(4);
});
```

上述代码执行顺序也就是洋葱圈：  Log(1)  -> await next (Log(3)) -> await next -> Log(4) -> Log(2).

为了保证代码按照洋葱模型的执行顺序执行，程序需要在调用 next 的时候让代码等待，我称之为中断。

实际上以前想要实现这种执行顺序，只能依赖 cb， promise.then 来模拟，而且即便实现了，在写法上也显得臃肿和别扭，要么是写出很胖的函数，要么是写出很长的函数。而且没法处理调用栈的问题。

async/await 可以比较优雅的实现这种具有同步执行特征的前端代码来处理异步，代码执行到 await 这里，等待 await 表达式的执行，执行完成之后，接着往后执行。

实际上这很类似于 generator 的 yield，特性。async 也就是 generator + 执行器的一个语法糖, 参考：

- [async / await](../../js/syncAndAsync/async-await/readme.md)
- [co](../co/readme.md)
- [generator](../../js/syncAndAsync/generator/readme.md)



### async ？ no ， it's generator

koa.use 得确直接使用 async 函数处理中间件及其中可能存在的异步, 而 async/await 实现上是基于 generator 。async 在使用上可讲的点通常在他的 task 放在哪，以及执行时机 和 timeout ，promise 的执行顺序等。真正的中断特性得益于 generator。

一位不愿透漏姓名的同事问了我一个问题，怎么证明 async 是 generator + 执行器 的语法糖？这是不得不讨论一个问题。相关的讨论参考： [Async / Await > #generator 部分探讨](../../js/syncAndAsync/async-await/readme.md)



## 生态

koa 中间件并没有一个统一的 market 之类的地方，说实话找起来不是那么方便。如果你想找中间件的话，可以在 npm 上用 `koa-` 做关键字检索： https://www.npmjs.com/search?q=koa-

[官方 middleware](https://github.com/koajs?utf8=%E2%9C%93&q=compose&type=&language=javascript)


### 源码使用的中间件

- [koa-compose](https://github.com/koajs/compose)
    上面已有分析
- [koa-is-json](https://github.com/koajs/is-json)
    ```js
    function isJSON(body) {
        if (!body) return false;
        if ('string' == typeof body) return false;
        if ('function' == typeof body.pipe) return false;
        if (Buffer.isBuffer(body)) return false;
        return true;
    }
    ```
- [koa-convert](https://github.com/koajs/convert)
    用于兼容处理 generator 中间件，基本可以认为是 co + generator 中间件【也依赖 koa-compose 进行组织】


### other koa

社区常用中间件合集： [some middleware](./middleware/readme.md)



## 参考 & 鸣谢

- https://koa.bootcss.com/
- http://nodejs.cn/api/fs.html#fs_fs_readfile_path_options_callback
- https://juejin.im/post/5ba7868e6fb9a05cdf309292?utm_source=gold_browser_extension
