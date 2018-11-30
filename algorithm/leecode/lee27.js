/**
 *
 * 给定一个数组 nums 和一个值 val， 你需要原地移除所有数值等于 val 的元素， 返回移除后数组的新长度。
 * 不要使用额外的数组空间， 你必须在原地修改输入数组并在使用 O(1) 额外空间的条件下完成。
 * 元素的顺序可以改变。 你不需要考虑数组中超出新长度后面的元素。
 * 
 * 给定 nums = [0, 1, 2, 2, 3, 0, 4, 2], val = 2,
 * 函数应该返回新的长度 5, 并且 nums 中的前五个元素为 0, 1, 3, 0, 4。
 * 注意这五个元素可为任意顺序。
 * 你不需要考虑数组中超出新长度后面的元素。
 */

function removeElement(nums, val) {
    const len = nums.length
    let j = len - 1
    for (let i = 0; i < len;) {
        // 注意一个元素的时候
        if (i > j) {
            return i
        }
        if (nums[i] === val) {
            if (nums[j] !== val) {
                [nums[i], nums[j]] = [nums[j], nums[i]]
            }
            j --
        } else {
            i++
        }
    }
    return 0
}

const nums = [0]
const len = removeElement(nums, 0)
console.log(len, nums)


/**
 * lee 最佳答案: 简化思路. 找到不等于 val 的数直接和当前游标交换.
 * @param {*} nums 
 * @param {*} val 
 */
function removeElement1(nums, val) {
    var j = 0
    for (i = 0; i < nums.length; i++) {
        if (nums[i] != val) {
            nums[j++] = nums[i]
        }
    }
    return j
}