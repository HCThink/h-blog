/**
 * 给定一个整数， 编写一个函数来判断它是否是 2 的幂次方。

 示例 1:

     输入: 1
 输出: true
 解释: 20 = 1
 示例 2:

     输入: 16
 输出: true
 解释: 24 = 16
 示例 3:

     输入: 218
 输出: false
 */

/**
 * @param {number} n
 * @return {boolean}
 */
var isPowerOfTwo = function (n) {
    return n > 0 && n.toString(2).match(/1/g).length === 1;
};


/**
 * leecode 耗时最少解法
 * @param {number} n
 * @return {boolean}
 * 厉害了， 2**n 的二进制一定只有一个1，
 * 如果 n === 2 ** m ，那么 n & (n - 1) 一定是 -
 */
let isPowerOfTwo = function (n) {
    return n > 0 && !(n & (n - 1));
};

/*
let isPowerOfTwo = function(n) {
    let oneNums = 0;
    for (; n > 0; n >>= 1) {
        oneNums += n & 1 === 1 ? 1 : 0;
    }
    return oneNums === 1;
};
*/
