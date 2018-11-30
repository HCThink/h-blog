/**
 * 给定一个非负整数数组 A， 返回一个由 A 的所有偶数元素组成的数组， 后面跟 A 的所有奇数元素。
 * 你可以返回满足此条件的任何数组作为答案。
 *
 * 输入：[3, 1, 2, 4]
 输出：[2, 4, 3, 1]
 输出[4, 2, 3, 1]，[2, 4, 1, 3] 和[4, 2, 1, 3] 也会被接受。
 */


/**
 * @param {number[]} A
 * @return {number[]}
 */
var sortArrayByParity = function (A) {
    let i = 0;

    const f1 = [],
        f2 = [];
    while (i < A.length) {
        if (A[i] % 2 === 0) {
            f1.push(A[i]);
        } else {
            f2.push(A[i]);
        }
        i++;
    }

    return [...f1, ...f2];
};


const re = sortArrayByParity([1, 2, 4, 7, 3, 8, 9]);

console.log(re);


/**
 * leecode 最佳解法
 * @param {number[]} A
 * @return {number[]}
 */
var sortArrayByParity = function (A) {
    let evenList = [];
    let oddList = [];

    A.forEach((num) => {
        if (num % 2 == 0) {
            oddList.push(num);
        } else {
            evenList.push(num);
        }
    })

    return oddList.concat(evenList);
};
