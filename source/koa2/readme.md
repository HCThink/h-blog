# koa

[koa homepage](https://koa.bootcss.com/)

> 优秀的下一代 web 开发框架
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

- ctx.request： request
- ctx.response： response
- ctx.cookies

- ctx.request.accepts(types):  type 值可能是一个或多个 mime 类型的字符串，如 application/json，扩展名称如 json，或数组 ["json", "html", "text/plain"]。
- request.acceptsCharsets(charsets)

...

[更多参考](https://koa.bootcss.com/)



## 洋葱圈

### 使用层面

1. koa 洋葱圈使用：

- [koa 洋葱圈](#基础使用)
- [koa demo 主文件](./code/koa/app.js)

2. 简易实现版

> 执行方式： `tsc onionRings.ts --lib 'es2015' --sourceMap && node onionRings.js`

- [简易实现 main](./code/onionRings/onionRings.ts)

- [简易实现 外部中间件](./code/onionRings/koa-readFile.ts)
- [参考： koa-bodyparser](https://github.com/koajs/bodyparser/blob/master/index.js)

> main code
```typescript
public use(middleware: Function) {
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

- 如果习惯了回调的思路， 你会不会有这种疑惑： 洋葱圈机制于在 一个中间件中调用另一个中间件，被调中间件执行成功，回到当前中间件继续往后执行，这样不断调用，层级很深的话， 会不会形成一个很深的函数调用栈？ 从而影响性能， 同时形成「xx 地狱」？        -- ps（此问题源于分享时原同事 小龙 的提问。）

实际上这是个很好的问题，对函数执行机制比较了解才会产生的疑问。排除异步代码处理，我们很容易用同步方式模拟出这种调用层级。参考： [同步方式](./code/onionRings/callStack.js)。 这种模式存在明显的调用栈问题。

我可以负责任的回答： 不会的，下一个问题。 😂 😂

不会的原因在 generator 中详细介绍，一两句说不清楚。实际上我认为这里是有语法门槛的。在 generator 之前，用任何方式处理这个问题都显得怪异而且难以解决层级带来的性能问题。

详细说明参考： [generator 真.协程](../../js/syncAndAsync/generator/readme.md#真.协程)



## 源码

> KOA 源码特别精简, 不像 Express 封装的功能那么多

### 工程

### 源码

### 调试



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

实际上以前想要实现这种执行顺序，只能依赖 cb， promise.then 来模拟，而且即便实现了，在写法上也显得臃肿和别扭，要么是写出很胖的函数，要么是写出很长的函数。

async/await 可以比较优雅的实现这种有同步执行特征的前段代码，代码执行到 await 这里，等待 await 表达式的执行，执行完成之后，接着往后执行。

实际上这很类似于 generator 的 yield，特性。async 也就是 generator + 执行器的一个语法糖, 参考：

- [async / await](../../js/syncAndAsync/async-await/readme.md)
- [co](../co/readme.md)
- [generator](../../js/syncAndAsync/generator/readme.md)



### async ？ no ， it's generator

koa.use 得确直接使用 async 函数处理中间件及其中可能存在的异步, 但我要讲的不是 async/await，原因是 async、await 实现中是基于 genetator 的。 async 在使用上可讲的点通常在他的 task 放在哪，以及执行时机 和 timeout ，promise 的执行顺序等。真正的中断特性得益于 generator。

一位不愿透漏姓名的同事问了我一个问题，怎么证明 async 是 generator + 执行器 的语法糖？这是不得不讨论一个问题。相关的讨论参考： [Async / Await > #generator 部分探讨](../../js/syncAndAsync/async-await/readme.md)



### 不用 generator 怎么做？ cb ？ promise ？



## 生态


## 参考 & 鸣谢

- https://koa.bootcss.com/
- http://nodejs.cn/api/fs.html#fs_fs_readfile_path_options_callback
- https://juejin.im/post/5ba7868e6fb9a05cdf309292?utm_source=gold_browser_extension
