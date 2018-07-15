'use strict'

const root = typeof self == 'object' && self.self === self && self ||
    typeof global == 'object' && global.global === global && global ||
    this || {}

{
    const _ = {
        name: 'lib a',
        version: '3.0.0',
    }

    // ....

    root._ = _
}

{
    const previousLib = root._

    const _ = {
        name: 'lib b',
        version: '1.0.0',
    }
    _.noConflict = function () {
        root._ = previousLib
        return this
    }

    root._ = _
}

console.log(global._); // lib b 覆盖了 a 库
// { name: 'lib b', version: '1.0.0', noConflict: [Function] }

const LibB = _.noConflict()
console.log(global._, LibB);
// { name: 'lib a', version: '3.0.0' } { name: 'lib b', version: '1.0.0', noConflict: [Function] }


