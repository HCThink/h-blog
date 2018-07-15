/**
 * @Author: baidu
 * @Date:   2017-08-22T16:56:42+08:00
 * @Email:  hucheng@baidu.com
 * @Filename: is-Fun.js
 * @Last modified by:   baidu
 * @Last modified time: 2017-08-22T16:56:53+08:00
 */


class UN {
    constructor(...arg) {
        this.fn(...arg);
    }

    fn(...arg) {
        [
            'Arguments',
            'Function',
            'String',
            'Number',
            'Date',
            'RegExp',
            'Error'
        ].map(function(name) {
            // debugger;
            this['is' + name] = function(obj) {
                return Object.prototype.toString.call(obj) === '[object ' + name + ']';
            };
        }.bind(this));
    }
}

console.log(new UN());