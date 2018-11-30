/**
 * 实现函数 ToLowerCase()， 该函数接收一个字符串参数 str， 并将该字符串中的大写字母转换成小写字母， 之后返回新的字符串。
 *
 * 输入: "Hello"
 * 输出: "hello"
 */

/**
 * @param {string} str
 * @return {string}
 * 我的提交执行用时
 * 已经战胜 81.64 % 的 javascript 提交记录
 */
var toLowerCase = function (str) {
    const letterMap = {
        A: 'a',
        B: 'b',
        C: 'c',
        D: 'd',
        E: 'e',
        F: 'f',
        G: 'g',
        H: 'h',
        I: 'i',
        J: 'j',
        K: 'k',
        L: 'l',
        M: 'm',
        N: 'n',
        O: 'o',
        P: 'p',
        Q: 'q',
        R: 'r',
        S: 's',
        T: 't',
        U: 'u',
        V: 'v',
        W: 'w',
        X: 'x',
        Y: 'y',
        Z: 'z',
    };

    let lowerCaseLetter = '';
    for (let index = 0; index < str.length; index ++) {
        const curLetter = str[index];
        lowerCaseLetter += letterMap[curLetter] || curLetter;
    }

    return lowerCaseLetter;
};

const re = toLowerCase('AbCdEfG');

console.log(re);



/**
 * leecode 最佳解法
 * @param {string} str
 * @return {string}
 */
let toLowerCase = function (str) {
    let letterDictionary = {
        A: "a",
        B: "b",
        C: "c",
        D: "d",
        E: "e",
        F: "f",
        G: "g",
        H: "h",
        I: "i",
        J: "j",
        K: "k",
        L: "l",
        M: "m",
        N: "n",
        O: "o",
        P: "p",
        Q: "q",
        R: "r",
        S: "s",
        T: "t",
        U: "u",
        V: "v",
        W: "w",
        X: "x",
        Y: "y",
        Z: "z"
    };
    let result = "";
    for (let i = 0, len = str.length; i < len; i += 1) {
        result += str[i] in letterDictionary ? letterDictionary[str[i]] : str[i];
    }
    return result;
};


/**
 * @param {string} str
 * @return {string}
 * other
 */
var toLowerCase = function (str) {
    if (str.length === 0) {
        return ''
    }
    let newStr = ''
    for (let i = 0; i < str.length; i++) {
        let code = str[i].charCodeAt()
        // 判断是否ASCII码区间是否为大写字母区间
        if (code >= 65 && code <= 90) {
            code += 32
            newStr += String.fromCharCode(code)
        } else {
            newStr += str[i]
        }
    }
    return newStr
};
