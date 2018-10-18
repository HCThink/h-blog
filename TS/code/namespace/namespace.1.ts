
/// <reference path="namespace.2.ts" />

/**
 * 这么写需要将多个文件编译到一个文件中： tsc --outFile namespace.1.js  namespace.1.ts
 * 然后  node namespace.1.js 执行。 否则两个文件没法建立联系。
 */
namespace n1{
    let x = 10;
    console.log(fn());;
}

namespace n2 {
    new Vue();

    export class Person {
        constructor(public name: string, public age: number) {}
    }
}

// 同文件 多个 namespace 也需要 export
namespace n2 {
    new Person('liming', 13);
}
