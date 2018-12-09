/**
 * 实现 strStr() 函数。
 *
 * 给定一个 haystack 字符串和一个 needle 字符串， 在 haystack 字符串中找出 needle 字符串出现的第一个位置(从0开始)。 如果不存在， 则返回 - 1。
 *
 * 示例 1:
 *
 *     输入: haystack = 'hello', needle = 'll'
 * 输出: 2
 * 示例 2:
 *
 *     输入: haystack = 'aaaaa', needle = 'bba'
 * 输出: -1
 * 说明:
 *
 *     当 needle 是空字符串时， 我们应当返回什么值呢？ 这是一个在面试中很好的问题。
 *
 * 对于本题而言， 当 needle 是空字符串时我们应当返回 0。 这与C语言的 strstr() 以及 Java的 indexOf() 定义相符。
 */

function indexOf(haystack, needle) {
    if (needle === '') {
        return 0;
    }
    const needleLen = needle.length
    const haystackLen = haystack.length
    debugger
    if (needleLen > haystackLen) {
        return -1;
    }

    for (let i = 0; i < haystackLen - needleLen + 1; i++) {
        // console.log(haystack.substring(i, i + needleLen));
        if (needle === haystack.substring(i, i + needleLen)) {
            return i;
        }
    }
    return -1;
}

console.log(indexOf('hello', 'lg'));


/**
 * leecode 耗时最少解法
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function (haystack, needle) {
    if (needle == "") {
        return 0;
    }
    return haystack.indexOf(needle);
};
