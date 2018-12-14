const fs = require('fs');
const path = require('path');
const stringTemplate = require('string-template');

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

const BASE_PATH = './';
const ROOT_PATH = './algorithm/leecode/';
const OUT_FILE = path.resolve('./readme.md');
const DEFAULT_CONTEXT = [
    '# Leecode\n\n',
    '> 共计 {count} 题【已实现】\n\n'
];

const ROOT_TABLE_DESC = '\n\n';
const DEFAULT_TABLE_length = 6;
const DEFAULT_TABLE = [
    '|  |  |  |  |  |  |\n',
    '| ------ | ------ | ------ | ------ | ------ | ------ |\n',
];

async function genReadmeMd () {
    const fileList = await fs.readdirPromise(path.resolve(BASE_PATH));
    const filterList = filter(fileList);

    const baseList = [];
    const rootList = [];

    filterList.forEach((item, index) => {
        let baseRow = `| [${item}](${BASE_PATH}${item}) `;
        let rootRow = `| [${item}](${ROOT_PATH}${item}) `;
        if ((index + 1) % DEFAULT_TABLE_length === 0) {
            baseRow = baseRow + '|\n';
            rootRow = rootRow + '|\n';
        }
        baseList.push(baseRow);
        rootList.push(rootRow);
    });

    baseList.unshift(...DEFAULT_CONTEXT.map((item) => stringTemplate(item, {
        count: baseList.length
    })) , ...DEFAULT_TABLE);
    rootList.unshift(...DEFAULT_TABLE);
    const allList = baseList.concat(ROOT_TABLE_DESC, rootList);

    await fs.writeFilePromise(OUT_FILE, allList.join(''));

    return [fileList, filterList];
}


genReadmeMd().then(([fileList, { length }]) => {
    console.log('自动输出完成');
    console.log(`已完成：${length}, other：${fileList.length - length}.`);
})
