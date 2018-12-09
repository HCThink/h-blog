/**
 * 给定一个包含 0, 1, 2, ..., n 中 n 个数的序列， 找出 0..n 中没有出现在序列中的那个数。

 示例 1:

     输入: [3, 0, 1]
 输出: 2
 示例 2:

     输入: [9, 6, 4, 2, 3, 5, 7, 0, 1]
 输出: 8
 */

/**
 * @param {number[]} nums
 * @return {number}
 * 的提交执行用时
 已经战胜 96.86 % 的 javascript 提交记录
 Runtime(ms) Distribution( % )
 */
var missingNumber = function (nums) {
    let sum = nums[0];
    const len = nums.length;
    for (let i = 1; i < len; i ++) {
        sum += nums[i];
    }

    return (1 + len) * len / 2 - sum;
};


const re = missingNumber([9, 6, 4, 2, 3, 8, 7, 0, 1]);

console.log(re);


/**
 * leecode 耗时最少解法
 * @param {number[]} nums
 * @return {number}
 */
let missingNumber = function (nums) {
    let res = 0;
    for (let i = 0; i <= nums.length; i++) {
        res ^= i ^ nums[i];
    }
    return res;
};

/*
let missingNumber = function(nums) {
    let res = nums.length * (nums.length + 1) / 2;
    nums.forEach(num => res -= num);
    return res;
};
*/
