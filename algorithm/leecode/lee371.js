/**
 * 不用加减法计算两数只和
 */

function getSum(a, b) {
    if (b == 0 || a == 0) { //没有进为的时候完成运算
        return a || b;
    }
    let sum = a ^ b; // 进行异或计算
    let carry = (a & b) << 1; // 与计算并向左移一位
    return getSum(sum, carry);
}

const f = getSum(7, 10);

console.log(f);


/**
 * leecode 耗时最少解法
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
var getSum = function (a, b) {
    if (a == 0) return b;
    if (b == 0) return a;
    var temp = a ^ b;
    var temp2 = (a & b) << 1;
    return getSum(temp, temp2);
};
