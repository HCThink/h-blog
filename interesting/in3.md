# n 道 JavaScript 难题

> 我以前也觉得这些是糟粕，说起来都很无聊，但是如果放任这些不了解，你怎么能写出避免这些糟粕的好代码呢？ 杠精请狗带。

1. 输出什么

Q:
```javascript
["1", "2", "3"].map(parseInt)
```

A: [1, NaN, NaN]

Why:

map 给每个回调提供两个参数, value, index.

parseInt 函数接受两个参数(string, Hexadecimal), 前者是转换的值, 后者表示进制.

故而每次 map ,分别对应的是将 parseInt('1', 0)   0 同10进制.同不传.
parseInt('2', 1) 没有1进制, parseInt('3', 2), 二进制字面量只有 0 和 1, 3不是有效字面量

Other:

```javascript
["1", "1", "11","5"].map(parseInt) //[1, NaN, 3, NaN]
parseInt('13',2)    // 1 ,
// 计算机在二进制只认识0，1，parseInt转换时就当作不认识的字符忽略了
parseInt('18str')     //18   10进制能认识到9
parseInt(1/0，19)     // 18
// 1/0 == Infinity 19  进制计算机能认识最后一个字符是i
```
`parseInt(1/0，19)     // 18 ` 解释如下

`1/0 == Infinity 19`

十九进制

|Base 19  | Base 10 (decimal)|
| - | - |
|  0  |   0 |
|  1  |   1 |
|  2  |   2 |
|  3  |   3 |
|  4  |   4 |
|  5  |   5 |
|  6  |   6 |
|  7  |   7 |
|  8  |   8 |
|  9  |   9 |
|  a  |  10 |
|  b  |  11 |
|  c  |  12 |
|  d  |  13 |
|  e  |  14 |
|  f  |  15 |
|  g  |  16 |
|  h  |  17 |
|  i  |  18 |

---

2. `[typeof null, null instanceof Object]`

    // ["object", false]

---

3. 作用域
Q: 变种1
```javascript
var name = 'World!';
(function () {
if (typeof name === 'undefined') {
    var name = 'Jack';
    console.log('Goodbye ' + name);
} else {
    console.log('Hello ' + name);
}
})();
```

A: `Goodbye Jack`

Why:

js 没有级块作用域, 变量提升

变种2
```javascript
var str = 'World!';
(function (name) {
if (typeof name === 'undefined') {
    var name = 'Jack';
    console.log('Goodbye ' + name);
} else {
    console.log('Hello ' + name);
}
})(str);
```

A: `Hello word`

Why: js 没有级块作用域, 变量提升.

执行过程分析: 匿名自调用触发函数调用. 函数初始化函数上下文, 变量对象, 函数内的对象声明挂载到变量对象上, 其中包括最早声明的 arguments, 然后是形参赋值. 接着之行代码.所以之行 if 之前 name 已经被赋值了 word

---

7. 数组
Q:
```javascript
var ary = [0,1,2];
ary[10] = 10;
ary.filter(function(x) { return x === undefined;});

ary[8]  // undefined
```

A: `[]`

Why:

没有手动赋值的数组元素被认为是空元素, filter 不会对空数组进行检测。会跳过那些空元素.

请注意区分手动赋值和赋值 undefined 的区别, 虽然上述代码访问  ary[8]  // undefined

```javascript
var ary = [0,1,2,undefined,undefined,undefined,null];
      ary.filter(function(x) { return x == undefined;});
      // [undefined, undefined, undefined, null]
```

其实在 chrome console 下输出 ary 得到的是
`(11) [0, 1, 2, empty × 7, 10]`.

delete 之后也是 empty

```javascript
delete ary[0]
(11) [empty, 1, 2, empty × 7, 10]
```

---

19. 形参和 arguments
Q:
```javascript
function sidEffecting(ary) {
  ary[0] = ary[2];
}
function bar(a,b,c) {
  c = 10
  sidEffecting(arguments);
  return a + b + c;
}
bar(1,1,1)
```

A: `ES6- -> 21` `ES6+ -> 12`

Why:

ES5 : 形参正常情况下和 arguments 一一关联. 但是 arguments 的初始化只取决于调用时传入的参数, 如果`bar(1, 1)`, 此时 arguments 的 length 则是 2, 也就是说 c 和 argumengs[2] 没有做关联. 此时修改 c 不会同步到 arguments

ES6: 中 arguments 和 形参同样同步. 但是有一种情况例外, 就是 ES6 如果用了默认参数后, arguments 和形参没有关联了, 往往形成误解, 其实es6并没有取消关联, 因为这影响实在太大了, 实际上默认参数是个语法糖, 代码会被转译成无参模式.这是导致没法关联的本因.

```javascript
function bar(a = 1, b, c) {}
// 的实现用该是这样:
function bar() {
  var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var b = arguments[1];
  var c = arguments[2];
}
```

严格模式: 实际上真正没有关联的情况是 'use strict'.
```javascript
function fn (a, b, c) {
    'use strict'
    arguments[0] = 1;
    b = 2;
    c = 3;
    arguments[2] = 4;

    console.log(arguments);     // 1 0 4
    console.log(a, b, c);       // 0 2 3
}

fn(0, 0)
```

---

28.
Q:
```javascript
var a = [1, 2, 3],
b = [1, 2, 3],
c = [1, 2, 4]
a ==  b
a === b
a > c
a < c
```

A:
```javascript
const arrayProperNames = Object.getOwnPropertyNames(Array.prototype);
arrayProperNames.map((prope) => {
    if (typeof Array.prototype[prope] === 'function') {
        const fn = Array.prototype[prope];
        Array.prototype[prope] = function (...arg) {
            console.log(prope);
            return fn.call(this, ...arg)
        }
    }
})

var a = [1, 2, 3],
    b = [1, 2, 3],
    c = [1, 2, 4]

console.log('==');
a == b
console.log('===');
a === b
console.log('>');
a > c
console.log('<');
a < c

// ==
// ===
// >
// toString
// join
// toString
// join
// <
// toString
// join
// toString
// join
```



---
[原文](http://javascript-puzzlers.herokuapp.com/)

[掘金](https://juejin.im/post/5b1f899fe51d4506c60e46ee)
