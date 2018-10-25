// @ts-check 开启类型检查和错误提示


/** @type {number} */
let ftc;

ftc = 0; // OK
// @ts-ignore: 忽略本行错误
ftc = false; // Error: boolean is not assignable to number
