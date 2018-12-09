/**
 * 回文数
 * 121 -> true
 * -11 -> false
 * 10   -> false
 *
 * 翻转数组来比较.
 * 其实比较第一位和最后一位也可以. 不相等则返回 false
 */

function isPalindrome(x) {
    if (x < 0) {
        return false
    }

    let rex = 0
    let tx = x;
    while(tx != 0) {
        rex = rex * 10 + Math.floor(tx) % 10
        tx = Math.floor(tx / 10)
    }

    return rex === x
}

console.log(isPalindrome(21212))


/**
 * leecode 耗时最少解法
 * @param {number} x
 * @return {boolean}
 */
let isPalindrome = function (x) {
    if (x < 0 || (x % 10 === 0 && x !== 0)) return false;
    let revert = 0;
    while (x > revert) {
        revert = (revert * 10) + x % 10;
        x = Math.floor(x / 10);
    }
    return x === revert || x === Math.floor(revert / 10);
};
