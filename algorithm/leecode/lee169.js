/**
 * 给定一个大小为 n 的数组， 找到其中的众数。 众数是指在数组中出现次数大于⌊ n / 2⌋ 的元素。

 你可以假设数组是非空的， 并且给定的数组总是存在众数。

 输入: [2, 2, 1, 1, 1, 2, 2]
 输出: 2

 注意一个数组中不可能有多个众数， 因为众数个数大于一半

 */

/**
 * @param {number[]} nums
 * @return {number}
 * 我的提交执行用时
 已经战胜 84.33 % 的 javascript 提交记录
 */
var majorityElement = function (nums) {
    const countList = {};
    const len = nums.length;

    for(let i = 0; i < len; i ++) {
        const cur = nums[i];
        countList[cur] = countList[cur] + 1 || 1;

        if (countList[cur] > len / 2) {
            return cur;
        }
    }
};


const re = majorityElement([1, 2, 1, 1, 1, 1, 1, 2, 3, 1, 2]);
console.log(re);


/**
 * leecode 耗时最少解法
 * @param {number[]} nums
 * @return {number}
 */

//  [1, 2, 1, 2, 1, 2, 2];
let majorityElement = function (nums) {
    let count = 0;
    let candidate = 0;
    for (let num of nums) {
        if (count === 0) {
            candidate = num; // 1
        }

        // 思路很巧妙，此题限定众数一定存在，所以众数的个数比其他所有数的和都多。
        // 所以我们假设将众数和其他数间隔排布，一个众数抵消一个其他数字， 最后一定剩下的是众数。
        // 但是这种算法不稳定，一定会将数组遍历结束，假设某个数组长度为 n， 其中 n-1 个数是 m，
        // 此时我们只需要遍历 n / 2 + 1 次就能找到众数。
        count = candidate === num ? count + 1 : count - 1;
    }
    return candidate;
};

/*
let majorityElement = function(nums) {
    let map = {};
    for (let num of nums) {
        map[num] = map[num] + 1 || 1;
        if (map[num] > nums.length / 2) {
            return num;
        }
    }
};
*/


/**
 * 优化, 这种优化针对很特殊的数据. [1, 2, 2, 2, 2, 2, 2, .... , 2]
 * @param {*} nums
 */
let majorityElement = function (nums) {
    let count = 0;
    let candidate = 0;
    let len = nums.length;
    for (let i = 0; i < len; i ++) {
        if (count === 0) {
            candidate = nums[i]; // 1
        }
        count = candidate === nums[i] ? count + 1 : count - 1;

        if(count > len / 2) {
            return candidate;
        }
    }
    return candidate;
};
