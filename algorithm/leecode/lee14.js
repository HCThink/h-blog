/**
 * 最长公共前缀
 * [
 *      'a b c'
 *      'a b d'
 *      'a b f'
 *      'a b c d'
 * ]
 *
 * 思路: 将这个字符串数组看做二维数组.我们外层无限循环, 因为不知道最短的字符串
 */

function longestCommonPrefix(strs = []) {
    let i = 0
    if (strs.length < 2) {
        return strs[0] || ''
    }
    while(true) {
        for (let j = 1; j < strs.length; j++) {
            debugger;
            if (strs[0][i] !== strs[j][i] || strs[0].length === i || strs[j].length === i) {
                return strs[0].substring(0, i);
            }
        }
        i++;
    }
    return strs[0].substring(0, i);
}

console.log(longestCommonPrefix(['abdd', 'abdww', 'abdcdd']))


/**
 * leecode 最佳解法
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function (strs) {
    if (strs.length == 0) return "";
    let prefix = strs[0];
    for (let i = 1; i < strs.length; i++)
        while (strs[i].indexOf(prefix) != 0) {
            prefix = prefix.substring(0, prefix.length - 1);
            if (prefix.length == 0) return "";
        }
    return prefix;
};
