/**
 * 给定一个整数， 写一个函数来判断它是否是 3 的幂次方。

 示例 1:

     输入: 27
 输出: true
 示例 2:

     输入: 0
 输出: false
 示例 3:

     输入: 9
 输出: true
 示例 4:

     输入: 45
 输出: false
 进阶：
 你能不使用循环或者递归来完成本题吗？
 */

/**
 * @param {number} n
 * @return {boolean}
 */
var isPowerOfThree = function (n) {
    if (n <= 0) {
        return false;
    }
    // 取巧做法， 用换底公式可得到： Math.log10(n) / Math.log10(3)  = 等价于[此方法不存在只是说明问题] log3（n）。。。。
    var num = Math.log10(n) / Math.log10(3);
    return num % 1 === 0;
};

const re = isPowerOfThree(81);

console.log(re);




/**
 * leecode 耗时最少解法
 * @param {number} n
 * @return {boolean}
 */
var isPowerOfThree = function (n) {
    let a = n;
    while (a !== 0) {
        if (a === 1) {
            return true;
        }
        if (a % 3 !== 0) {
            return false;
        }
        a = Math.floor(a / 3);
    }
    return false;
};
