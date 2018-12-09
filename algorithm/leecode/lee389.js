/**
 *
 给定两个字符串 s 和 t， 它们只包含小写字母。

 字符串 t 由字符串 s 随机重排， 然后在随机位置添加一个字母。

 请找出在 t 中被添加的字母。



 示例:

     输入：
 s = "abcd"
 t = "acbde"

 输出：
 e

 解释：
     'e'
 是那个被添加的字母。
 */


/**
 * @param {string} s
 * @param {string} t
 * @return {character}
 *
 * 1 ^ 1 = 0 , 则将字母转化为数字，然后将最终的数组转换为字母， 同 lee136.js
 * 我的提交执行用时
 已经战胜 95.31 % 的 javascript 提交记录
 */
var findTheDifference = function (s, t) {
    let sum = t[t.length - 1].charCodeAt();
    for (let i = 0; i < s.length; i ++) {
        sum ^= (s[i].charCodeAt() ^ t[i].charCodeAt());
    }

    return String.fromCharCode(sum);
    // 97 是小写字母 a 的 chatcode， 减去 97 之后加上10转36进制, 对应的方法就是 String.fromCharCode
    // return (sum - 97 + 10).toString(36);
};

const s = "abcd";
const t = "abcde";

const re = findTheDifference(s, t);

console.log(re);


/**
 * leecode 耗时最少解法
 * @param {string} s
 * @param {string} t
 * @return {character}
 */
let findTheDifference = function (s, t) {
    let code = 0;
    for (let c of s + t) {
        code ^= c.charCodeAt(0);
    }
    return String.fromCharCode(code);
};

/*
let findTheDifference = function(s, t) {
    let map = new Map();
    for (let c of s) {
        map.set(c, map.get(c) + 1 || 1);
    }
    for (let c of t) {
        let val = map.get(c);
        if (val === undefined || val === 0) {
            return c;
        }
        map.set(c, val - 1);
    }
};
*/
