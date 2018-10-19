# 函数

> 第一公民

函数是JavaScript应用程序的基础。 它帮助你实现抽象层，模拟类，信息隐藏和模块。 在TypeScript里，虽然已经支持类，命名空间和模块，但函数仍然是主要的定义 行为的地方。

TypeScript为JavaScript函数添加了额外的功能，让我们可以更容易地使用。


1. 函数类型 & 推断类型
```typescript
function add(x: number, y: number): number {
    return x + y;
}

// 完整的函数表达式定义应该是如下这样的， 尽管看起来是一个很蠢的语法。臃肿而啰嗦。
let myAdd: (x: number, y: number) => number =
    function(x: number, y: number): number { return x + y; };

// 推断类型
// 如果你在赋值语句的一边指定了类型但是另一边没有类型的话，TypeScript编译器会自动识别出类型：
// 通常是推荐使用如下方案: 函数类型包含两部分：参数类型和返回值类型。
let myAdd = function(x: number, y: number): number { return x + y; };
// or
let myAdd: (baseValue: number, increment: number) => number =
    function(x, y) { return x + y; };
```

2. 形参实参严格匹配 & 可选参数 & 默认参数

- 形参实参严格匹配： 基本上 TS 的形参和实参需要严格匹配， 体现在个数， 类型，顺序等等上，函数定义需要两个某某类型的参数， 你就必须传入两个对应类型的参数。

- 可选参数： TS 里我们可以在参数名旁使用 ?实现可选参数的功能, 可选参数必须位于所有必选参数之后
```typescript
// error: 必选参数不能位于可选参数后。
function fn(a?: number, b: number): number {
    return a + b;
}
```

- 默认参数: 同 es6【undefined 触发默认值】, 如果某个参数有默认值，并且其后没有必选参数，则他等价于有初始化的可选参数。

   - 带默认值的参数不需要放在必须参数的后面。
   - 但如果默认参数不在末尾，是没法跳过默认参数的，你必须传入一个值占位。
   - 如果你想让不在尾部的默认值产生作用，则需要传入 `undefined` 去触发默认值。

3. 剩余参数

同 ES6 。

当一个函数有剩余参数时，它被当做任意个可选参数。


4. this

学习如何在JavaScript里正确使用this就好比一场成年礼。

```typescript
// 爱奇艺面试题。我在最后给面试官的时候，改了答案。 ps： 不讨论严格模式。浏览器环境换成 window 即可。
global.length = 10;
+function p(a) {
    arguments[0]();
    this.length = 20;
    arguments[0]();
}(function () {
    console.log(this.length)
});
```

ps： 怎么说吧，我认为这是 js 中比较糟粕的东西，但是不了解糟粕，你就没法避免他。总之这个问题不在本文讨论范畴。

TS 文档中有很长一段介绍剪头函数带来的 this 和 this 类型问题， 可以参考原文。 我的建议是，函数中不要出现 this， 如果需要一个可以 new 的函数类模板，就声明成 class。

但是还有个问题： 如果将 class 实例的方法作为参数传到函数中， 还是没法避免。
```typescript
class A{
    name: 'A: { fn: function }';
    f1() {
        console.log(this);
    }
}

function fn(f) {
    f();
}

let obj = new A();
fn(obj.f1);             // undefined
fn(obj.f1.bind(obj));   // A {}
```

5. Overload 重载

js 本身就能接受任意个参数，实际上本身就支持某种意义上的重载。 但是 js 的重载有个很大的问题是： 重载逻辑没法分离，或者需要一个 switch 或者多 if 去做分离。实际上并不是很理想的重载。

函数或者方法重载有两个维度：（重载和形参的名字无关，形参只是占位，所以重载函数和位置强相关）。

- 参数类型重载
- 参数个数重载。

重载需要注意：

- 重载函数只有函数声明，没有函数体。类似于接口中的函数声明。
- 函数重载声明必须紧邻函数实现。
- 重载函数必须和其实现的参数个数保持一致，如果存在个数重载，则可用非必传参数占位【非必须】
- 返回值重载没有太多限制。参考第三个例子 or [重载](./code/polymorphism/src/Tool.ts)

TS 提供的重载也没有比较好的解决这个问题。

```typescript
// 重载函数
function f1(x: string, z?: any): string;
// 重载函数
function f1(x: string, y: boolean): string;
// error 重载函数和函数体之间不能有其他声明, 函数实现缺失或未立即出现在声明之后。
// function pn(x, y): void {}
// 逻辑体，非重载函数
function f1(x, y): any {
    if (typeof (x) === 'string' && !y) {
        // f1Deal1(x);
    } else if (typeof (x) === 'string' && y && typeof (y) === 'boolean') {
        // f2Deal(x, y);
    } else {
        // ....
        // dealFefault()
    }
}

f1('JS');
f1('TS', true);
```

class 中的重载
```typescript
class A{
    // 重载函数
    f1(x: string, y?: any): string;
    // 重载函数
    f1(x: string, y: boolean): string;
    // 逻辑体，非重载函数
    f1(x, y): any {
        if (typeof(x) === 'string' && !y) {
            // f1Deal1(x);
        } else if (typeof (x) === 'string' && y && typeof(y) === 'boolean') {
            // f2Deal(x, y);
        } else {
            // ....
            // dealFefault()
        }
    }
}
```

也可以参考多态中 `Tools.ts` 的写法去实现 __个数重载__
```typescript
export default class Tools {
    static Log(): void;
    static Log(data: any): string;
    static Log(data?: any): string {
        if (data) {
            const dataStr = JSON.stringify(Object(data), null, 4)
            console.log();
            console.log(dataStr);
            return dataStr;
        } else {
            console.log();
        }
    }
}
```

联合类型 配合 类型保护 下的重载[解决重载中非必要的 any 类型 和 需要断言 的问题, 上述 Tools.ts 确实需要 any 类型]
```typescript
// 重载函数
function f1(x: number): string;
function f1(x: boolean): string;
function f1(x: string): string;
// 逻辑体，非重载函数
function f1(x: (number | string | boolean)): number | string | boolean | string[] {
    let re: number | string | boolean | string[];

    // 类型保护
    if (typeof x === 'number') {
        // 理论上联合类型这里不能使用 number 独有的操作，如果要使用， 需要断言。
        // 这里能够不断言是 if 和 typeof 的类型保护产生的效果
        re = x++;
    } else if (typeof x === 'string') {
        re = x.split('');
    } else if (typeof x === 'boolean') {
        re = !!x && 'success';
    }
    // 还不能支持类型保护，or 写法错误？
    // switch(typeof x) {
    //     case 'number': re = x++;
    //         break;
    //     case 'boolean': re = !!x && 'success';
    //         break;
    //     case 'string': re = x.split('');
    //         break;
    // }
    return re;
}

console.log(f1(10));
console.log(f1(!0));
console.log(f1('typescript'));
```


---


## 理解：

1. 捕获变量： 函数可以使用函数体外部的变量[作用域链]。 当函数这么做时，我们说它‘捕获’了这些变量, 例如如下代码中的 `a` 变量
```typescript
const a = 10;
function fn(x: number): number {
    return a + x;
}
```
2. 函数的类型只是由参数类型和返回值组成的。 函数中使用的捕获变量不会体现在类型里。 实际上，这些变量是函数的隐藏状态并不是组成API的一部分。
