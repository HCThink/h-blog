/**
 * 如果数组是单调递增或单调递减的， 那么它是单调的。

 如果对于所有 i <= j， A[i] <= A[j]， 那么数组 A 是单调递增的。 如果对于所有 i <= j， A[i] > = A[j]， 那么数组 A 是单调递减的。

 当给定的数组 A 是单调数组时返回 true， 否则返回 false。



 示例 1：

 输入：[1, 2, 2, 3]
 输出： true
 示例 2：

 输入：[6, 5, 4, 4]
 输出： true
 示例 3：

 输入：[1, 3, 2]
 输出： false
 示例 4：

 输入：[1, 2, 4, 5]
 输出： true
 示例 5：

 输入：[1, 1, 1]
 输出： true


 提示：

 1 <= A.length <= 50000 -
     100000 <= A[i] <= 100000
 */


/**
 * @param {number[]} A
 * @return {boolean}
 *
 * 从前往后迭代， 两个相邻的数之差，第一次不相等的时候，把他录到 difference 上 作为基准，这个数和之后任意两个数
 * 的差求乘， 如果和为整数 则必定是相同的升降序。
 */
var isMonotonic = function (A) {
    if (A.length < 3) {
        return true;
    }

    let difference = 0;
    for(let i = 0; i < A.length - 1; i ++) {
        const di = A[i] - A[i + 1];
        if (difference === 0) {
            difference = di;
        } else if (di * difference < 0) {
            return false;
        }
    }
    return true;
};

const re = isMonotonic([1, 2, 5, 4, 5]);
console.log(re);



/**
 * leecode 耗时最少解法
 * @param {number[]} A
 * @return {boolean}
 *
 * 没想明白为啥比我的快
 */
var isMonotonic = function (A) {
    let x = 0;

    for (let i = 0; i < A.length - 1; i += 1) {
        if (A[i] > A[i + 1]) {
            x = 1;
            break;
        } else if (A[i] < A[i + 1]) {
            x = -1;
            break;
        }
    }
    let result = true;
    if (x === -1) {
        for (let i = 0; i < A.length - 1; i += 1) {
            if (A[i] > A[i + 1]) {
                result = false;
            }
        }
    } else if (x === 1) {
        for (let i = 0; i < A.length - 1; i += 1) {
            if (A[i] < A[i + 1]) {
                result = false;
            }
        }
    }
    return result
};
