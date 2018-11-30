/**
 * 给定一个整数数组和一个目标值， 找出数组中和为目标值的两个数。

 你可以假设每个输入只对应一种答案， 且同样的元素不能被重复利用。

 示例:

     给定 nums = [2, 7, 11, 15], target = 9

 因为 nums[0] + nums[1] = 2 + 7 = 9
 所以返回[0, 1]
 */

function twoSum (nums, target) {
    const reMap = {};

    for (let index = 0; index < nums.length; index++) {
        const cur = nums[index];

        if(reMap[target - cur] >= 0) {
            return [reMap[target - cur], index]
        } else {
            reMap[cur] = index;
        }
    }
}

const nums = [1, 2, 4, 8, 12];
const target = 12

const ts1 = twoSum(nums, target);
console.log(ts1, '->', [nums[ts1[0]], nums[ts1[1]]]);


/**
 * 上述算法由输出下标, 改为输出结果
 */

function twoSum1(nums, target) {
    const reMap = {};

    for (let index = 0; index < nums.length; index++) {
        const cur = nums[index];

        if (typeof reMap[cur] !== 'undefined') {
            return [reMap[cur], cur];
        } else {
            reMap[target - cur] = cur;
        }
    }
}

const ts2 = twoSum1(nums, target);
console.log(ts2);


/**
 * leecode 最佳解法
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum3 = function(nums, target) {

    var map = {};
    for(var i = 0 ; i < nums.length ; i++){
        var v = nums[i];

        if(map[target-v] >= 0){
            // 如果 target - v可以在map中找到值x，代表之前已经出现过的值x， target = x + v
            // 因此回传x的位置与目前v的位置
            return [map[target-v],i]
        } else {
            // 使用map储存目前的数字与其位置

            map[v] = i;
        }
    }
};
