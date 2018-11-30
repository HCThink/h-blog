/**
 * 在杨辉三角中， 每个数是它左上方和右上方的数的和。
 *
 * 示例:
 *
 *     输入: 3
 * 输出: [1, 3, 3, 1]
 * 进阶：
 *
 * 你可以优化你的算法到 O(k) 空间复杂度吗？
 */

function genRow(rowIndex) {
    if (rowIndex < 0) {
        return [];
    }
    let row = [1];
    for (let i = 1; i < rowIndex + 1; i++) {
        let temp = [1];
        for (let j = 0; j <= i; j++) {
            temp[j] = (row[j - 1] || 0) + (row[j] || 0)
        }
        row = temp;
    }
    
    return row;
}


/**
 * leecode 最佳解法
 * @param {*} nums 
 * @param {*} target 
 */
function leeGenRow(k) {
    let results = Array(k + 1).fill(1)
    for (let i = 0; i < k + 1; i++) {
        for (let j = i - 1; j >= 1; j--) {
            console.log(i, j, results);
            results[j] = results[j] + results[j - 1]
        }
    }
    return results
}

// console.log(genRow(4));
console.log(leeGenRow(4));