# javascript 文件类型检查

> 文件类型检查

为什么要写到 js 中，然后用 TS 的很多特性？ 不是很明白， 兼容老代码？ 感觉只会让这文件四不像。这里梳理部分内容

[javascript 文件类型检查](https://www.tslang.cn/docs/handbook/type-checking-javascript-files.html)

---

TypeScript 2.3以后的版本支持使用--checkJs对.js文件进行类型检查和错误提示。因为本身是 js 文件，所以需要指定 `--outFile`

在 js 文件中 添加 `// @ts-check 开启类型检查和错误提示`, 执行如下编译命令即可对 js 进行类型检查和错误提示.
和 `// @ts-nocheck 忽略类型检查` 相反。

```sh
tsc --allowJs ftc.1.ts --outFile ftc.1.ts.js
```

- 忽略本行的错误:                          `// @ts-ignore`


---

## .js文件和.ts文件在类型检查上的差异

1. 用JSDoc类型表示类型信息

.js文件里，类型可以和在.ts文件里一样被推断出来。 同样地，当类型不能被推断时，它们可以通过JSDoc来指定，就好比在.ts文件里那样。

```javascript
/** @type {number} */
var x;

x = 0;      // OK
x = false;  // Error: boolean is not assignable to number
```

2. 属性的推断来自于类内的赋值语句

ES2015没提供声明类属性的方法。属性是动态赋值的，就像对象字面量一样。

```js
class C {
    constructor() {
        /** @type {number | undefined} */
        this.prop = undefined;
        /** @type {number | undefined} */
        this.count;
    }
}

let c = new C();
c.prop = 0;          // OK
c.count = "string";  // Error: string is not assignable to number|undefined
```

省略部分内容

3. 对象字面量是开放的
```javascript
var obj = { a: 1 };
obj.b = 2;  // Allowed

/** @type {{a: number}} */
var obj = { a: 1 };
obj.b = 2;  // Error, type {a: number} does not have property b
```

4. null，undefined，和空数组的类型是any或any[]

5. 函数参数是默认可选的
```javascript
function bar(a, b) {
  console.log(a + " " + b);
}

bar(1);       // OK, second argument considered optional
bar(1, 2);
bar(1, 2, 3); // Error, too many arguments
```


---


## 支持的JSDoc

- @type
- @param (or @arg or @argument)
- @returns (or @return)
- @typedef
- @callback
- @template
- @class (or @constructor)
- @this
- @extends (or @augments)
- @enum


#### @type

1. TS 中出现的类型，大多都可以出现在这里，包括类型转换【断言】
```js
/**
 * @type {number | string}
 */
var numberOrString = Math.random() < 0.5 ? "hello" : 100;
var typeAssertedNumber = /** @type {number} */ (numberOrString)
```

#### @param @returns
```js
// Parameters may be declared in a variety of syntactic forms
/**
 * @param {string}  p1 - A string param.
 * @param {string=} p2 - An optional param (Closure syntax)
 * @param {string} [p3] - Another optional param (JSDoc syntax).
 * @param {string} [p4="test"] - An optional param with a default value
 * @return {string} This is the result
 */
function stringsStringStrings(p1, p2, p3, p4){
  // TODO
}
```

#### @template

使用@template声明泛型：


剩余部分参考：

[javascript 文件类型检查](https://www.tslang.cn/docs/handbook/type-checking-javascript-files.html)
