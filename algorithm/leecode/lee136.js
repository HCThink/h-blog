/**
 * 给定一个非空整数数组， 除了某个元素只出现一次以外， 其余每个元素均出现两次。 找出那个只出现了一次的元素。

 说明：

 你的算法应该具有线性时间复杂度。 你可以不使用额外空间来实现吗？

 示例 1:

     输入: [2, 2, 1]
 输出: 1
 示例 2:

     输入: [4, 1, 2, 1, 2]
 输出: 4
 */

/**
 * @param {number[]} nums
 * @return {number}
 *
 *  首先 a ^ a = 0, a ^ 0 = a.
 *  我们将数组展开 a1 ^ a2 ^ ... a11 ^ a22 ^ an[假设 a1 === a11], 通过交换律得到
 *  (a1 ^ a11) ^ （a2 ^ a22）...则结果 0 ^ aTarget = aTarget
 */
var singleNumber = function (nums) {
    let sum = nums[0];
    for (let i = 1; i < nums.length; i ++) {
        sum ^= nums[i];
    }

    return sum;
};

const re = singleNumber([4, 1, 2, 1, 2]);

console.log(re);


/**
 * leecode 耗时最少解法
 * @param {*} nums
 */
var singleNumber = function (nums) {
    return nums.reduce(function (pre, cur) {
        return pre ^ cur;
    })
};

/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function (nums) {
    let init = 0
    nums.forEach(d => {
        init ^= d
    })
    return init
};
