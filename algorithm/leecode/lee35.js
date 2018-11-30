/**
 * 给定一个排序数组和一个目标值， 在数组中找到目标值， 并返回其索引。 如果目标值不存在于数组中， 返回它将会被按顺序插入的位置。
 *
 * 你可以假设数组中无重复元素。
 * 
 * 示例 1:
 *     输入: [1, 3, 5, 6], 5
 * 输出: 2
 * 示例 2:
 *
 *     输入: [1, 3, 5, 6], 2
 * 输出: 1
 * 示例 3:
 *
 *     输入: [1, 3, 5, 6], 7
 * 输出: 4
 * 示例 4:
 *
 *     输入: [1, 3, 5, 6], 0
 * 输出: 0
 */

function searchInsert(nums, target) {
    const len = nums.length
    if (target > nums[len - 1]) {
        return len
    }
    for (let index = 0; index < len; index++) {
        if (nums[index] >= target) {
            return index
        } else if (nums[index] < target && target < nums[index + 1]) {
            return index + 1;
        }
    }
}

console.log(searchInsert([1, 3, 5, 6], 7))


/**
 * leecode 最佳解法
 * @param {*} nums 
 * @param {*} target 
 */
var searchInsert1 = function (nums, target) {
    if (nums.includes(target)) {
        return nums.indexOf(target);
    }
    return nums.filter(el => el < target).length;
};