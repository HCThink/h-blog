
'use strict';

/**
 * Module dependencies.
 */

const isGeneratorFunction = require('is-generator-function');
const debug = require('debug')('koa:application');
const onFinished = require('on-finished');
const response = require('./response');
const compose = require('koa-compose');
const isJSON = require('koa-is-json');
const context = require('./context');
const request = require('./request');
const statuses = require('statuses');
const Emitter = require('events');
const util = require('util');
const Stream = require('stream');
const http = require('http');
const only = require('only');
const convert = require('koa-convert');
const deprecate = require('depd')('koa');

/**
 * Expose `Application` class.
 * Inherits from `Emitter.prototype`.
 */

/**
 * application.js 是 koa 的入口文件， 它向外导出了创建 class 实例的构造函数，
 * 它继承了 events， 这样就会赋予框架事件监听和事件触发的能力
 *    const Emitter = require('events');
 *
 * application 还暴露了一些常用的 api， 比如 toJSON、 listen、 use 等等。
 *    listen
 *    toJSON
 *    inspect
 *    use
 *    callback
 *    handleRequest
 *    createContext
 *    onerror
 */
module.exports = class Application extends Emitter {
  /**
   * Initialize a new `Application`.
   *
   * @api public
   */

  constructor() {
    super();

    this.proxy = false;
    // 中间件 list
    this.middleware = [];
    this.subdomainOffset = 2;
    this.env = process.env.NODE_ENV || 'development';

    // 挂载核心对象： ctx， req， res
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create#Polyfill
    this.context = Object.create(context);

    // request response 封装了大量针对 req res 的 get set 以及一些工具操作
    /**
     * Object.create 主要代码：
        function F() {}
        F.prototype = proto;

        return new F();
     */
    this.request = Object.create(request);
    this.response = Object.create(response);

    if (util.inspect.custom) {
      this[util.inspect.custom] = this.inspect;
    }
  }

  /**
   * Shorthand for:
   *
   *    http.createServer(app.callback()).listen(...)
   *
   * @param {Mixed} ...
   * @return {Server}
   * @api public
   */

  listen(...args) {
    debug('listen');
    // http://nodejs.cn/api/http.html#http_http_createserver_options_requestlistener

    // 封装 http.createServer 重点是这个函数中传入的 this.callback，它里面包含了中间件的合并，上下文的处理，对res的特殊处理。
    // let server = http.createServer((req, res) => {
    //     // ...
    // });
    // server.listen(3000, () => {
    //   console.log('listenning on 3000');
    // });

    const server = http.createServer(this.callback());
    return server.listen(...args);
  }

  /**
   * Return JSON representation.
   * We only bother showing settings.
   *
   * @return {Object}
   * @api public
   */

  toJSON() {
    // https://github.com/tj/node-only
    // only 过滤
    return only(this, [
      'subdomainOffset',
      'proxy',
      'env'
    ]);
  }

  /**
   * Inspect implementation.
   *
   * @return {Object}
   * @api public
   */

  inspect() {
    return this.toJSON();
  }

  /**
   * Use the given middleware `fn`.
   *
   * Old-style middleware will be converted.
   *
   * @param {Function} fn
   * @return {Application} self
   * @api public
   */
  /**
   * use 是收集中间件， 将多个中间件放入 middleware 队列中， 然后通过 koa-compose 这个插件进行递归组合调用这一系列的中间件。
   */
  use(fn) {
    // 类型判断
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    // 3+版本将会移除 generator
    if (isGeneratorFunction(fn)) {
      // nodejs-depd 就是一个专门处理模块废弃属性或者方法的工具，它可以很方便地标记出模块已经废弃的方法或者属性，方便模块更新并且不影响用户使用。
      // 参考: https://www.huxinmin.com/home/5b03d29f0bcdea05baee98e8.html
      deprecate('Support for generators will be removed in v3. ' +
                'See the documentation for examples of how to convert old middleware ' +
                'https://github.com/koajs/koa/blob/master/docs/migration.md');
      // koa-convert 将基于 Generator 函数实现的中间件，转化成 Koa 2.x 的中间件。
      // https://github.com/koajs/convert/blob/master/index.js
      // 基本上可以认为是 co + generator = async fn。
      fn = convert(fn);
    }
    debug('use %s', fn._name || fn.name || '-');
    // 注册 middleware.
    this.middleware.push(fn);
    // 链式
    return this;
  }

  /**
   * Return a request handler callback
   * for node's native http server.
   *
   * @return {Function}
   * @api public
   */

  /**
   * 提供 listen server 的处理逻辑
   * http.createServer(this.callback());
   */
  callback() {
    /**
     * 简单来讲就是组织 middleware， 大致将 use 注册的 middleware 进行组织关联, 返回一个执行器。
     * 执行器的作用大致是依次执行每个中间件，并且注入 context 和 next , next 的逻辑比较关键
     *
     * compose 主要代码：
     return function (context, next) {
       // last called middleware #
       let index = -1
       return dispatch(0)

       function dispatch(i) {
         if (i <= index) return Promise.reject(new Error('next() called multiple times'))
         index = i
         let fn = middleware[i]
         if (i === middleware.length) fn = next
         if (!fn) return Promise.resolve()
         try {
           return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
         } catch (err) {
           return Promise.reject(err)
         }
       }
     }
     *
     * https://github.com/koajs/compose
     */
    const fn = compose(this.middleware);

    // http://nodejs.cn/api/events.html#events_events
    // 继承: eventEmitter.
    if (!this.listenerCount('error'))
      this.on('error', this.onerror);

    // 用于 http.createServer((req, res) => {});
    const handleRequest = (req, res) => {
      // Initialize a new context.
      // 这里传的 ctx 才是传入 middleware 的 ctx， 并非 context.js export 出来的。跟进到 createContext 可见对去进行了包装
      const ctx = this.createContext(req, res);
      // middleware 执行器
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }

  /**
   * Handle request in callback.
   *
   * @api private
   */

  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    // context  的 error 处理， 注意区分好几个 onerror
    const onerror = err => ctx.onerror(err);
    // 中间件全部执行完成 的 then 事件
    const handleResponse = () => respond(ctx);

    // Execute a callback when a HTTP request closes, finishes, or errors.
    // https://github.com/jshttp/on-finished
    onFinished(res, onerror);

    // return fnMiddleware<Promise>
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }

  /**
   * Initialize a new context.
   * 如下部分的快捷引用是互相配合使用的，虽然相互配合能够达到比较易容的效果，
   * 但同时复杂度也提升了，需要好好梳理，我们以 request 为例说明整个配合过程：
   *
   *  1. req【 原始对象】， 挂载到 context 上： context.req
   *  2. this.request 挂载到 context 上： context.request
   *  3. 将 context.request 下的部分操作委托到 context 上。
   *  4. context.request 里面的很多操作 直接使用 req 原始对象数据，比如： return this.res.statusMessage
   *
   * 大致如此
   *
   * @api private
   */

  createContext(req, res) {
    // 对引入的 context 进行包装和扩展，添加更多的属性和快捷引用
    const context = Object.create(this.context);

    // 在 context 上挂载 koa 封装的 request， response
    // 这里挂载的并不是原始引用，而是 obj extends  this.request ，注意这个并不是 http 的 request。
    const request = context.request = Object.create(this.request);
    const response = context.response = Object.create(this.response);

    // 快捷引用
    context.app = request.app = response.app = this;
    // 在 context, request, response 上挂载【互相引用】 request，response 原始对象
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;

    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;

    context.originalUrl = request.originalUrl = req.url;
    // Koa 还约定了一个中间件的存储空间 ctx.state。通过 state 可以存储一些数据，比如用户数据，版本信息等。
    // 如果你使用 webpack 打包的话，可以使用中间件，将加载资源的方法作为 ctx.state 的属性传入到 view 层，方便获取资源路径。
    context.state = {};

    return context;
  }

  /**
   * Default error handler.
   *
   * @param {Error} err
   * @api private
   */

  onerror(err) {
    if (!(err instanceof Error)) throw new TypeError(util.format('non-error thrown: %j', err));

    if (404 == err.status || err.expose) return;
    if (this.silent) return;

    const msg = err.stack || err.toString();
    console.error();
    console.error(msg.replace(/^/gm, '  '));
    console.error();
  }
};

/**
 * Response helper.
 */

function respond(ctx) {
  // allow bypassing koa
  if (false === ctx.respond) return;

  const res = ctx.res;
  /*
    get writable() {
       // can't write any more after response finished
       if (this.res.finished) return false;
       ......
    }
  */
  if (!ctx.writable) return;

  let body = ctx.body;
  const code = ctx.status;

  // ignore body
  // https://github.com/jshttp/statuses
  // Returns true if a status code expects an empty body.
  if (statuses.empty[code]) {
    // strip headers
    ctx.body = null;
    return res.end();
  }

  // TODO
  if ('HEAD' == ctx.method) {
    if (!res.headersSent && isJSON(body)) {
      // Buffer 类是一个全局变量， 使用时无需 require('buffer').Buffer。
      ctx.length = Buffer.byteLength(JSON.stringify(body));
    }
    return res.end();
  }

  // status body
  if (null == body) {
    // 返回 HTTP 版本的第一个整数值
    if (ctx.req.httpVersionMajor >= 2) {
      body = String(code);
    } else {
      body = ctx.message || String(code);
    }
    if (!res.headersSent) {
      ctx.type = 'text';
      ctx.length = Buffer.byteLength(body);
    }
    return res.end(body);
  }

  // responses
  if (Buffer.isBuffer(body)) return res.end(body);
  if ('string' == typeof body) return res.end(body);
  if (body instanceof Stream) return body.pipe(res);

  // body: json
  body = JSON.stringify(body);
  if (!res.headersSent) {
    // 返回字符串的实际字节长度。 与 String.prototype.length 不同，后者返回字符串的字符数。
    ctx.length = Buffer.byteLength(body);
  }
  res.end(body);
}
