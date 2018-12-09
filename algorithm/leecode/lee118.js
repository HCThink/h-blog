/**
 * 给定一个非负整数 numRows， 生成杨辉三角的前 numRows 行。
 * https: //upload.wikimedia.org/wikipedia/commons/0/0d/PascalTriangleAnimated2.gif
 *
 * 输入: 5
 *   输出: [
 *       [1],
 *       [1, 1],        1: 1,0  1: 1,1
 *       [1, 2, 1],
 *       [1, 3, 3, 1],
 *       [1, 4, 6, 4, 1]        4: 4,1 = 3,0 + 3,1   6: 4,2 = 3,1 + 3,2
 *   ]
 *
 * 我的提交执行用时
 * 已经战胜 97.78 % 的 javascript 提交记录
 */

function generate(numRows) {
    if (numRows < 1) {
        return [];
    }
    const genArr = [[1]];
    for (let i = 1; i < numRows; i++) {
        genArr[i] = [];
        for (let j = 0; j <= i; j++) {
            genArr[i][j] = (genArr[i - 1][j - 1] || 0) + (genArr[i - 1][j] || 0)
        }
    }

    return genArr;
}

const yh5 = generate(5);

console.log(JSON.stringify(yh5, null, 4));


/**
 * leecode 耗时最少解法
 * @param {number} numRows
 * @return {number[][]}
 */
let generate = function (numRows) {
    if (numRows === 0) return [];
    if (numRows === 1) return [
        [1]
    ];
    let arr = [
        [1]
    ];
    for (let i = 1; i < numRows; ++i) {
        let row = [1];
        for (let j = 1; j < arr[i - 1].length; ++j) {
            row.push(arr[i - 1][j - 1] + arr[i - 1][j])
        }
        row.push(1);
        arr.push(row);
    }
    return arr;
};
