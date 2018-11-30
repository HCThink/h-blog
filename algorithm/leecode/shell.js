const fs = require('fs');
const path = require('path');

/**
 *
 * @param {*} fn: SPS : (a, b, c, ..., cb) => {}
 */
function promiseIfyCps(fn) {
    return (...args) => {
        return new Promise((resolve, reject) => {
            fn(...args, (error, data) => {
                if (error) {
                    reject(error);
                }

                resolve(data);
            });
        })
    };
}

['readdir', 'readFile', 'stat', 'write', 'writeFile'].map((item, index) => {
    fs[item + 'Promise'] = promiseIfyCps(fs[item]);
});


const filterList = [/^lee*/];
const ignoreList = [/\.todo\./];
const numReg = /\d+/;
const sortFn = (a, b) => {
    try {
        return a.match(numReg)[0] - b.match(numReg)[0];
    } catch(err) {
        return true;
    }
}


function filter (list = []) {
    return list.filter((li) => {
        const filterMap = filterList.filter((fi) => fi.test(li));
        const ignoreMap = ignoreList.filter((fi) => !fi.test(li));

        return filterMap.length === filterList.length && ignoreMap.length === ignoreList.length;
    }).sort(sortFn);
}

const BASE_PATH = path.resolve('./');
const OUT_FILE = path.resolve('./readme.md');
 const context = '# Leecode';

async function genReadmeMd () {
    const fileList = await fs.readdirPromise(BASE_PATH);
    const filterList = filter(fileList);

    const writeList = filterList.map((item) => {
        return `- [${item}](./${item})`
    });

    writeList.unshift(context, `\n> 共计 ${writeList.length} 题【已实现】`, '\n');

    await fs.writeFilePromise(OUT_FILE, writeList.join('\n'));

    return [fileList, filterList];
}


genReadmeMd().then(([fileList, { length }]) => {
    console.log('自动输出完成');
    console.log(`已完成：${length}, TODO：${fileList.length - length}.`);
})
