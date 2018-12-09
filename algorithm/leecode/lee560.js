/**
 * 给定一个整数数组和一个整数 k， 你需要找到该数组中和为 k 的连续的子数组的个数。

 示例 1:

     输入: nums = [1, 1, 1], k = 2
 输出: 2, [1, 1] 与[1, 1] 为两种不同的情况。
 说明:

     数组的长度为[1, 20, 000]。
 数组中元素的范围是[-1000, 1000]， 且整数 k 的范围是[-1e7, 1e7]。
 */

/**
 * 先判断单个数, 如果等于则 reCount, 最慢
 */
let re = [];

function subarraySum(nums, k) {
    let pos = 0;
    let index = 0;
    let reCount = 0;
    let sum = 0;
    while (pos < nums.length) {
        sum += nums[index];
        if(sum === k) {
            reCount++;
            re.push(nums.slice(pos, index + 1));
        }
        if (++index >= nums.length) {
            index = ++ pos + 1;
            sum = nums[pos];

            if (sum === k) {
                reCount++;
                re.push(nums.slice(pos, pos + 1));
            }
        }
    }

    return reCount;
}

/**
 * 先判断当前数字, 等于则 res 自增, 然后和其后的数逐个求和, 遇到等于 k 的情况则 res 自增
 * @param {*} nums
 * @param {*} k
 */
function subarraySum1(nums, k) {
    let sums = 0;
    let res = 0;
    for (let index = 0; index < nums.length; index++) {
        sums = nums[index];
        if(sums === k) {
            res ++;
        }

        for (var j = index + 1; j < nums.length; j++) {
            sums += nums[j];
            if (sums == k) ++res;
        }
    }

    return res;
}


function subarraySum2(nums, k) {
    var res = 0;
    var sum = 0;

    var map = new Map();
    map.set(0, 1);
    for (var i = 0; i < nums.length; i++) {
        sum += nums[i];

        if (map.get(sum - k)) {
            res += map.get(sum - k);
        }
        if (map.get(sum)) {
            map.set(sum, map.get(sum) + 1);
        } else {
            map.set(sum, 1);
        }
    }

    return res;
}

const subArrCount = subarraySum([2, 1, 1, 1, 2, -1, 1, 1], 2);
const subArrCount1 = subarraySum1([2, 1, 1, 1, 2, -1, 1, 1], 2);
const subArrCount2 = subarraySum2([2, 1, 1, 1, 2, -1, 1, 1], 2);
console.log(subArrCount, subArrCount1, subArrCount2);
console.log(re);


/**
 * leecode 耗时最少解法
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function (nums, k) {
    let res = 0,
        sum = 0,
        n = nums.length;
    let m = new Map();
    m.set(0, 1);
    for (let i = 0; i < n; i++) {
        sum += nums[i];
        res += m.has(sum - k) ? m.get(sum - k) : 0;
        let cur_sum = m.has(sum) ? m.get(sum) : 0;
        m.set(sum, cur_sum + 1);
    }
    return res;
};
