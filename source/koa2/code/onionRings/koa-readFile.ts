// @ts-ignore
import * as fs from 'fs';

/**
 * 一个外部中间件
 * @param file 文件名称
 * @param conf 配置
 */
export default function countCharacter(file: string, conf = { encoding: 'utf-8' }) {
    return async (ctx, next) => {
        const data = await new Promise((resolve, reject) => {
            fs.readFile(file || ctx.file, conf, (err, data: string) => {
                err && reject(err);
                resolve({
                    data,
                    length: data.length
                });
            })
        });

        // 中间件的插拔很容易，所以外部中间件很多，中间件也会有各种组合，所以中间件之间不要有数据传递
        // 中间件的处理和数据都反馈到 ctx 上。
        ctx.context = data;

        await next();
    };
}
