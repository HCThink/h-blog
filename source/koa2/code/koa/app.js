import Koa from 'koa';
import https from 'https';
import open from 'open';

const Log = console.log;
const App = new Koa();

App.use(async (ctx, next) => {
    ctx.request.accepts('text/html');
    // 检查 encodings 是否可以接受
    ctx.acceptsEncodings(['gzip', 'deflate', 'identity']);
    ctx.acceptsCharsets('utf-8');

    Log('mid1 start...');
    await next();
    Log('mid1 end...');
});

App.use(async (ctx, next) => {
    ctx.body = '<marquee><h2>Hello World!</h2> -- 鲁迅</marquee>';
    Log('mid2 start...');
    await next();
    Log('mid2 end...');
});


App.use((ctx, next) => {
    Log('mid3...');
    debugger;
    Log(ctx.inspect());
});

// 服务监听： 两种方式。
App.listen(3000);           // 语法糖
// http.createServer(app.callback()).listen(3000);
https.createServer(App.callback()).listen(3001, () => {
    // open('http://localhost:3000')
});

// 如下为执行顺序， 实际上 http 会握手，所以输出多次
// 如下执行特征也就是洋葱圈， 实际上熟悉 async、await 则不会比较意外。
// mid1 start...
// mid2 start...
// mid3...
// mid2 end...
// mid1 end...
