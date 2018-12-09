/**
 * 假设你有一个很长的花坛， 一部分地块种植了花， 另一部分却没有。 可是， 花卉不能种植在相邻的地块上， 它们会争夺水源， 两者都会死去。

 给定一个花坛（ 表示为一个数组包含0和1， 其中0表示没种植花， 1 表示种植了花）， 和一个数 n。 能否在不打破种植规则的情况下种入 n 朵花？ 能则返回True， 不能则返回False。

 示例 1:

     输入: flowerbed = [1, 0, 0, 0, 1], n = 1
 输出: True
 示例 2:

     输入: flowerbed = [1, 0, 0, 0, 1], n = 2
 输出: False
 注意:

     数组内已种好的花不会违反种植规则。
 输入的数组长度范围为[1, 20000]。
 n 是非负整数， 且不会超过输入数组的大小。
 */

/**
 * @param {number[]} flowerbed
 * @param {number} n
 * @return {boolean}
 *
 * 我的提交执行用时
 已经战胜 87.18 % 的 javascript 提交记录
 */
var canPlaceFlowers = function (flowerbed, n) {
    for (let i = 0; i < flowerbed.length; i++) {
        // 因为数组里有大量 0 ， 所以经常执行这个 逻辑或。
        const pre = flowerbed[i - 1] || 0;
        const next = flowerbed[i + 1] || 0;

        console.log(pre, flowerbed[i], next);

        // 当前数和前后数只和为 0 则可以种植
        n -= (pre + flowerbed[i] + next) ? 0 : (flowerbed[i] = 1, n++, 1);
        if (n <= 0) {
            return true;
        }
    }
    return false;
};

const re = canPlaceFlowers([1, 0, 0, 0, 1], 2);
console.log(re);



/**
 * leecode 耗时最少解法
 * @param {number[]} flowerbed
 * @param {number} n
 * @return {boolean}
 */
var canPlaceFlowers = function (flowerbed, n) {
    var count = 0
    for (var i = 0; i < flowerbed.length; i++) {
        if (flowerbed[i] == 0) {
            if (i == 0 && flowerbed[i + 1] != 1) {
                flowerbed[i] = 1
                count++
            } else if (i == flowerbed.length - 1 && flowerbed[i - 1] != 1) {
                flowerbed[i] = 1
                count++
            } else {
                if (flowerbed[i - 1] != 1 && flowerbed[i + 1] != 1) {
                    flowerbed[i] = 1
                    count++
                }
            }
        }
    }
    if (count < n) {
        return false
    } else {
        return true
    }
};
