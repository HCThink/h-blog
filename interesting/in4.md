# How to do


1. 快速获取毫秒数

```js
const now = +new Date();
```

2. 平铺多维数组

```js
// 仅仅适用于二维数组。不过，通过递归，我们可以平铺任意维度的嵌套数组。
const arr = [11, [22, 33], [44, 55], 66];
const flatArr = [].concat(...arr); //=> [11, 22, 33, 44, 55, 66]

// flat 法
[1,2, [1, [2, [3]]]].flat()
// (4) [1, 2, 1, Array(2)]

// 提供另一种场景化很强的思路。

// 其实有更简单的. 任意维度数组都可以搞定，
arr.join().split(',')

// 但是存在风险： 类型会变。我们可以提供 转换回调。
// 平铺数字数组 + 转换回调
[1,2, [1, [2, 1+ 2 +1, Number(true)]]].join().split(',').map((index) => Number(index))  // (6) [1, 2, 1, 2, 4, 1]

// 对于通式
Arr.join().split(',').map(fn)
```

这个方法可能限制很多,比如数组元素类型不一致, 比如非基础类型等

第一个问题： 我们不妨想想，一个数组中既有 number，又有 string 是合理么？实际上这种数组在逻辑，潜在风险和处理上存在非常多的问题。大多数情况下是一个不好的设计。
但是如果配合 Typescript 这种往往类型统一的数组， 转换回调则会比较简单处理，则会有比较好的场景。

第二个问题：非基础类型则不好处理， 其实像这种比较 Hacker 的方法， 往往不是用于处理普遍情况的，往往是在特殊场景发挥奇效的。没有最好的方案，只有最合适的方案。

仅仅是另一种思路。

3. 快速取整

```js
// api
Math.floor(10.8222)
// 双位移
console.log(~~47.11) // -> 47
console.log(~~-12.88) // -> -12
console.log(~~1.9999) // -> 1
console.log(~~3) // -> 3
//失败的情况
console.log(~~[]) // -> 0
console.log(~~NaN) // -> 0
console.log(~~null) // -> 0
//大于32位整数则失败
console.log(~~(2147483647 + 1) === (2147483647 + 1)) // -> 0
```

4. 格式化输出

```js
const obj = {
    foo: { bar: [11, 22, 33, 44], baz: { bing: true, boom: 'Hello' } }
};
// The third parameter is the number of spaces used to
// beautify the JSON output.
JSON.stringify(obj, null, 4);
// "{
//     "foo": {
//         "bar": [
//             11,
//             22,
//             33,
//             44
//         ],
//         "baz": {
//             "bing": true,
//             "boom": "Hello"
//         }
//     }
// }"
```

5. 大致测试一个JavaScript代码块性能的技巧

```js
console.time("Array initialize");
const arr = new Array(100);
const len = arr.length;
for (let i = 0; i < len; i++) {
    arr[i] = new Object();
};
console.timeEnd("Array initialize");
```

6. 您可以创建一个 100％ 纯对象，它不会从 Object 继承任何属性或方法（例如，constructor，toString() 等）

```js
const pureObject = Object.create(null);
console.log(pureObject); //=> {}
console.log(pureObject.constructor); //=> undefined
console.log(pureObject.toString); //=> undefined
console.log(pureObject.hasOwnProperty); //=> undefined
```

7. 普通必传参数校验

```js
const require = function( message ){
    throw new Error( message );
}
const getSum = (a = _err('a is not defined'), b = _err('b is not defined')) => a + b
getSum( 10 ) // throws Error, b is not defined
getSum( undefined, 10 ) // throws Error, a is not defined
```

8. 装饰器用作必传参数校验

如下为主要代码， 完整代码需要 Typescript 环境。

- [装饰器校验必传参数](../TS/code/decorators/decorators.5.ts)
- [装饰器](../TS/decorators.md)
- [Typescript](../TS/readme.md)

```typescript
@validate
greet(p1, p2, p3, @required name: string, p5) {
    // p1-5 仅仅用于占位， 用来测试 required 的第四个参数。
    return "Hello " + name + ", " + this.greeting;
}

// output
// throw (constructors.name + "." + String(method_1) + "[\u5B9E\u9645\u4E0A\u662F\uFF1A" + constructors.name + ".prototype." + String(method_1) + "]\u7B2C " +(index + 1) + " \u4E2A\u53C2\u6570\u662F\u5FC5\u4F20\u53C2\u6570\uFF0C\u8BF7\u63D0\u4F9B\u3002");
                        ^
// Greeter.greet[ Greeter.prototype.greet ] 第 4 个参数是必传参数，请提供。
```

9. 解构 arguments 转数组

```js
+function fn() {
    console.log([...arguments]);            // (4) [1, 2, 3, 4]
    console.log(Array.prototype.slice.call(arguments));
}(1,2,3,4)
```

### 参考 & 感谢

- http://www.css88.com/archives/9868
- https://www.jb51.net/article/78670.htm
