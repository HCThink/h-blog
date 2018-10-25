// @ts-check 开启类型检查和错误提示
/** @type {number} */
var ftc;
ftc = 0; // OK
// @ts-ignore
ftc = false; // Error: boolean is not assignable to number
