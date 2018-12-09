/**
 * 在二维平面上， 有一个机器人从原点(0, 0) 开始。 给出它的移动顺序， 判断这个机器人在完成移动后是否在(0, 0) 处结束。

 移动顺序由字符串表示。 字符 move[i] 表示其第 i 次移动。 机器人的有效动作有 R（ 右）， L（ 左）， U（ 上） 和 D（ 下）。 如果机器人在完成所有动作后返回原点， 则返回 true。 否则， 返回 false。

 注意： 机器人“ 面朝” 的方向无关紧要。“ R” 将始终使机器人向右移动一次，“ L” 将始终向左移动等。 此外， 假设每次移动机器人的移动幅度相同。

 输入: "UD"
 输出: true
 解释： 机器人向上移动一次， 然后向下移动一次。 所有动作都具有相同的幅度， 因此它最终回到它开始的原点。 因此， 我们返回 true。

 输入: "LL"
 输出: false
 解释： 机器人向左移动两次。 它最终位于原点的左侧， 距原点有两次“ 移动” 的距离。 我们返回 false， 因为它在移动结束时没有返回原点。
 */

/**
 * @param {string} moves
 * @return {boolean}
 * 思路： 相反方向的移动个数一样，则一定能回到原点。
 *      1. 移动路径为奇数， 不可能回到原点
 *      2. u.count === d.count && l.count === r.count 一定可以回到原点
 *
 * 我的提交执行用时
 * 已经战胜 92.40 % 的 javascript 提交记录
 *
 * 此方法是非迭代方法， 但是问题也很明显，不稳定，可以回到原点的情况下， 会执行四次 match 。
 */
var judgeCircle = function (moves) {
    if (moves.length % 2 !== 0) {
        return false;
    }

    // 我利用正则获取字符串中某个字符的长度，但是 match 可能会返回 null， 则需要先 test
    // 做容错， 未解决这个问题， 我每个字符串加一个无效移动【等价抵消】： UPLR 来避免 match 返回 null
    moves += 'UDLR';

    const uCount = moves.match(/U/g).length;
    const dCount = moves.match(/D/g).length;
    if (uCount !== dCount) {
        return false;
    }

    const lCount = moves.match(/L/g).length;
    const rCount = moves.match(/R/g).length;
    if (lCount !== rCount) {
        return false;
    }

    return true;
};


const re = judgeCircle('LRUDLLRD');
console.log(re);



/**
 * leecode 耗时最少解法
 * @param {string} moves
 * @return {boolean}
 */
var judgeCircle = function(moves) {
    let x = 0;
    let y = 0;

    let actions = moves.split('');
    actions.forEach((act) => {
        switch(act) {
            case 'U': {
                y++;
                break;
            }
            case 'D': {
                y--;
                break;
            }
            case 'R': {
                x++;
                break;
            }
            case 'L': {
                x--;
                break;
            }
        }
    })

    return x == 0 && y == 0;
};
