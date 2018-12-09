/**
 *
 编写一个函数， 输入是一个无符号整数， 返回其二进制表达式中数字位数为‘ 1’ 的个数（ 也被称为汉明重量）。

 示例:

     输入: 11
 输出: 3
 解释: 整数 11 的二进制表示为 00000000000000000000000000001011


 示例 2:

     输入: 128
 输出: 1
 解释: 整数 128 的二进制表示为 00000000000000000000000010000000

 */


/**
 * @param {number} n - a positive integer
 * @return {number}
 */
var hammingWeight = function (n) {
    let count = 0;
    while(n) {
        if(n & 1) {
            count ++;
        }

        n = n >>> 1;
    }
    return count;
};

const re = hammingWeight(127);

console.log(re);


/**
 * leecode 耗时最少解法
 * @param {number} n - a positive integer
 * @return {number}
 */
var hammingWeight = function (n) {
    let res = 0;
    for (; n !== 0; n = n >>> 1) {
        res += n & 1 === 1 ? 1 : 0;
    }
    return res;
};
