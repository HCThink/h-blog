/**
 * 自除数 是指可以被它包含的每一位数除尽的数。

 例如， 128 是一个自除数， 因为 128 % 1 == 0， 128 % 2 == 0， 128 % 8 == 0。

 还有， 自除数不允许包含 0。

 给定上边界和下边界数字， 输出一个列表， 列表的元素是边界（ 含边界） 内所有的自除数。

 示例 1：

 输入：
 上边界left = 1, 下边界right = 22
 输出：[1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 15, 22]
 注意：

 每个输入参数的边界满足 1 <= left <= right <= 10000。
 */


/**
 * @param {number} left
 * @param {number} right
 * @return {number[]}
 */
var selfDividingNumbers = function (left, right) {
    const selfDividingList = [];
    for (let i = left; i <= right; i ++) {
        let iStr = i.toString();
        let succ = true;
        for (let j = 0; j < iStr.length; j++) {
            if (!+iStr[j] || (i % iStr[j]) !== 0) {
                succ = false;
                break;
            }
            // console.log(iStr, iStr[j], (i % iStr[j]), !+iStr[j], (i % iStr[j]) !== 0);
        }
        succ && selfDividingList.push(i);
    }

    return selfDividingList
};


const re = selfDividingNumbers(9, 22);

console.log(re);



/**
 * leecode 耗时最少解法
 * @param {number} left
 * @param {number} right
 * @return {number[]}
 */
let selfDividingNumbers = function (left, right) {
    let res = [];
    for (let i = left; i <= right; ++i) {
        if (helper(i)) {
            res.push(i);
        }
    }
    return res;
};

let helper = function (num) {
    let tag = num;
    while (num > 0) {
        // 核心逻辑， 注： 10 % 0 不会抛错， 返回 NaN
        if (tag % (num % 10) !== 0) {
            return false;
        }
        // 霸气取整
        num = ~~(num / 10);
    }
    return true;
};
