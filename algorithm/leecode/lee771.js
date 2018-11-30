/**
 * 给定字符串J 代表石头中宝石的类型， 和字符串 S代表你拥有的石头。 S 中每个字符代表了一种你拥有的石头的类型，
 * 你想知道你拥有的石头中有多少是宝石。J 中的字母不重复， J 和 S中的所有字符都是字母。 字母区分大小写， 因此 "a"
 * 和 "A" 是不同类型的石头。
 */

 /**
  示例 1:

      输入: J = "aA", S = "aAAbbbb"
  输出: 3
  示例 2:

      输入: J = "z", S = "ZZ"
  输出: 0
  */

var numJewelsInStones = function (J, S) {
    const sList = S.split('');
    let count = 0;
    sList.map((item) => {
        if (J.indexOf(item) !== -1) {
            count ++;
        }
    });

    return count;
};


const count = numJewelsInStones('abc', 'AAaaBbCc');

console.log(count);


/**
 * leecode  最佳解法
 * @param {string} J
 * @param {string} S
 * @return {number}
 */
var numJewelsInStones = function (J, S) {
    var num = 0

    for (var i = 0; i < J.length; i++) {
        for (var j = 0; j < S.length; j++) {
            if (J[i] === S[j]) {
                num++
            }
        }
    }

    return num
};
