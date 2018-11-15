'use strict'

/**
 * node 执行： tsc onionRings.ts --lib 'es2015' --sourceMap && node onionRings.js
 * deno 执行： deno onionRings.ts: 因为存在文件引用， 以及 node原生模块 fs， 不建议使用 deno 执行
 */

import countCharacter from './koa-readFile';

namespace onionRings {
    interface Applicatipn {
        use(middleware: Function);
        listen(port: number);
    }

    const Log = (...any: any[]) => {
        // @ts-ignore
        console.log(...any);
    };

    const Loop = () => {};

    class App implements Applicatipn {
        private middList: Function[] = [];
        constructor() { }

        use(middleware: Function) {
            this.middList.push(middleware);
        }

        private async deal(i: number = 0) {
            debugger;
            if (i >= this.middList.length) {
                return false;
            }
            await this.middList[i](this, this.deal.bind(this, i + 1));
        }

        listen(port: number) {
            // @ts-ignore
            setTimeout(() => {
                debugger;
                this.deal();
            }, Math.random() * port);
        }
    }

    // test
    const app: Applicatipn = new App();

    app.use(async (ctx, next) => {
        Log(1);
        await next();
        Log(2);
    });

    app.use(async (ctx, next) => {
        Log(3);
        await next();
        Log(4);
    });

    // 外部中间件
    app.use(countCharacter('./onionRings.ts'));

    app.use(async (ctx, next) => {
        Log(ctx.context.length);
        const deal = await readFile('./onionRings.ts');
        Log(deal);

        await next();
    });

    app.listen(3000);

    function readFile(path: string, operate = { charles: 'utf-8' }) {
        return new Promise((resolve, reject) => {
            // @ts-ignore
            setTimeout(() => {
                resolve(5);
            }, 3000);
        });
    }

    // 1 3 5 4 2
}
