/**
 *
 颠倒给定的 32 位无符号整数的二进制位。

 示例:

     输入: 43261596
 输出: 964176192
 解释: 43261596 的二进制表示形式为 00000010100101000001111010011100，
 返回 964176192， 其二进制表示形式为 00111001011110000010100101000000。
 进阶:
     如果多次调用这个函数， 你将如何优化你的算法？
 */


/**
 * @param {number} n - a positive integer
 * @return {number} - a positive integer
 * 利用 & 1 找出 为 1 的二进制位。
 * 计算其
 */
var reverseBits = function (n) {
    let reNum = 0;
    let len = 32;
    while (len --) {
        // console.log(reNum, n & 1, len);
        reNum += 2 ** len * (n & 1)

        n = n >>> 1;
    }
    return reNum;
};

const re = reverseBits(43261596);

console.log(re);



/**
 * leecode 耗时最少解法
 * @param {number} n - a positive integer
 * @return {number} - a positive integer
 */
let reverseBits = function (n) {
    n = (n >>> 16) | (n << 16);
    n = (n >>> 8 & 0x00ff00ff) | (n << 8 & 0xff00ff00);
    n = (n >>> 4 & 0x0f0f0f0f) | (n << 4 & 0xf0f0f0f0);
    n = (n >>> 2 & 0x33333333) | (n << 2 & 0xcccccccc);
    n = (n >>> 1 & 0x55555555) | (n << 1 & 0xaaaaaaaa);
    return n >>> 0;
};

/*
let reverseBits = function(n) {
    let res = 0;
    for (let i = 0; i < 32; i++) {
        res <<= 1;
        res |= n & 1;
        n >>= 1;
    }
    return res >>> 0;
};
*/

// >>> 0 convert to unsigned Number
