/**
 * 两个整数之间的汉明距离指的是这两个数字对应二进制位不同的位置的数目。

 给出两个整数 x 和 y， 计算它们之间的汉明距离。

 注意：
 0≤ x, y < 231.

 示例:

     输入: x = 1, y = 4

 输出: 2

 解释:
     1(0 0 0 1)
 4(0 1 0 0)↑↑

 上面的箭头指出了对应二进制位不同的位置。
 */

/**
 * @param {number} x
 * @param {number} y
 * @return {number}
 * 异或运算符: 两个数转为二进制， 然后从高位开始比较， 如果相同则为0， 不相同则为1。
 */
var hammingDistance = function (x, y) {
    const re = (x ^ y);
    return re.toString(2).replace(0, '').length;
};


/**
 * leecode 耗时最少解法
 * @param {number} x
 * @param {number} y
 * @return {number}
 *
 * 位运算经典案例
 *
 * 使用 ^ 异或获得两个数不同的二进制位。
 * 使用 z & 1 能够得到最后一位是不是 1
 * 使用 >>> 1 去掉最后一位 【 >>> 也可用于二进制转换】
 */

let hammingDistance = function (x, y) {
    let count = 0;
    let z = x ^ y;
    while (z) {
        if (z & 1) {
            count++;
        }
        z = z >>> 1;
    }
    return count;
};

/**
let hammingDistance = function(x, y) {
    let count = 0;
    while (x !== 0 || y !== 0) {
        if ((x & 1) !== (y & 1)) {
            count++;
        }
        x = x >>> 1;
        y = y >>> 1;
    }
    return count;
};
 */
