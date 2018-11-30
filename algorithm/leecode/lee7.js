/**
 * 给出一个 32 位的有符号整数，你需要将这个整数中每位上的数字进行反转。
 *
 * 123 -> 321
 * -12300 -> -321
 */

function reverse(x) {
    var res = 0;
    var symbol = x > 0;
    x = x > 0 ? x : -x
    while (x != 0) {
        // 拿到最后一位拼到新数字的后面
        res = res * 10 + Math.floor(x) % 10;
        x = Math.floor(x / 10)
    }
    if (res > Math.pow(2, 31) - 1) return 0;
    return symbol ? res : -res;
}

console.log(reverse(1534269));


/**
 * leecode 最佳解法
 * @param {number} x
 * @return {number}
 */
let reverse = function (x) {
    let res = 0;
    while (x !== 0) {
        res = res * 10 + x % 10;
        x = x < 0 ? Math.ceil(x / 10) : Math.floor(x / 10);
    }
    return res < -(2 ** 31) || res > 2 ** 31 - 1 ? 0 : res;
};
