import url from 'url';
import path from 'path';
import process from 'process';
import fs from 'fs';

// 从package.json中
// 的dependencies、devDependencies获取项目所需npm模块信息
const ROOT_PATH = process.cwd();
const PKG_JSON_PATH = path.join(ROOT_PATH, 'package.json');
const PKG_JSON_STR = fs.readFileSync(PKG_JSON_PATH, 'binary');
const PKG_JSON = JSON.parse(PKG_JSON_STR);
// 项目所需npm模块信息
const allDependencies = {
    ...PKG_JSON.dependencies || {},
    ...PKG_JSON.devDependencies || {}
}

//Node原生模信息
const builtins = new Set(
    Object.keys(process.binding('natives')).filter((str) =>
        /^(?!(?:internal|node|v8)\/)/.test(str))
);

// 文件引用兼容后缀名
const JS_EXTENSIONS = new Set(['.js', '.mjs']);
const JSON_EXTENSIONS = new Set(['.json']);

// debugger;
export function resolve(specifier, parentModuleURL = 'file:\/\/', defaultResolve) {
    // 判断是否为Node原生模块
    if (builtins.has(specifier)) {
        return {
            url: specifier,
            format: 'builtin'
        };
    }

    // 判断是否为npm模块
    if (allDependencies && typeof allDependencies[specifier] === 'string') {
        return defaultResolve(specifier, parentModuleURL);
    }

    // 如果是文件引用，判断是否路径格式正确
    if (/^\.{0,2}[/]/.test(specifier) !== true && !specifier.startsWith('file:')) {
        throw new Error(
            `imports must begin with '/', './', or '../'; '${specifier}' does not`);
    }

    // 判断是否为*.js、*.mjs、*.json文件
    /**
     * 之前看 node 设计缺陷中说过 require or import 引用为了便利， 可以省略后缀让引擎去决策加载是个很大的缺陷，
     * 那时候还没有体会，这里表现的比较突出，比如：
     *      `import Promise from './es6-promise/promise';`
     * 这个语句其实带来的语义确实很不明确， 而且你需要额外的代码去做判断兼容， 确实是比较不好的设计。
     *
     * 这里取巧默认 import 引入的是 js。
     */

    let resolved = new url.URL(specifier, parentModuleURL);
    let ext = path.extname(resolved.pathname);
    if (!ext) {
        if (fs.existsSync(`${resolved.pathname}.js`)) {
            ext = '.js'
            resolved = new url.URL(`${specifier}.js`, parentModuleURL);
        } else {
            throw new Error(
                `no such file: ${resolved.pathname}.`);
        }
    }

    if (!JS_EXTENSIONS.has(ext) && !JSON_EXTENSIONS.has(ext)) {
        throw new Error(
            `Cannot load file with non-JavaScript file extension ${ext}.`);
    }

    // 如果是*.js、*.mjs文件
    if (JS_EXTENSIONS.has(ext)) {
        return {
            url: resolved.href,
            format: 'esm'
        };
    }

    // 如果是*.json文件
    if (JSON_EXTENSIONS.has(ext)) {
        return {
            url: resolved.href,
            format: 'json'
        };
    }
}
