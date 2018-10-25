# TS 2.7

1. 更严格的类属性检查

TypeScript 2.7引入了一个新的控制严格性的标记 --strictPropertyInitialization！

使用这个标记会确保类的每个实例属性都会在构造函数里或使用属性初始化器赋值。 在某种意义上，它会明确地进行从变量到类的实例属性的赋值检查

[update2.7 1](../code/update/update2.7/update.1.ts)

使用如下运行命令，运行该文件：
```shell
tsc --strictPropertyInitialization --strictNullChecks update.1.ts && node update.1.js
```

```typescript
class C {
    foo: number;
    bar = "hello";
    baz: boolean;
    //  ~~~
    //  Error! Property 'baz' has no initializer and is not assigned directly in the constructor.
    constructor() {
        this.foo = 42;
    }
}
```


2. 显式赋值断言

上述代码存在问题，某些场景下属性会被间接地初始化，这时候抛错是不应该的，此时我们应该显式赋值断言来告诉编译器。

显式赋值断言对声明普遍适用
```typescript
class C {
    foo!: number;
    // ^
    // Notice this exclamation point!
    // This is the "definite assignment assertion" modifier.
    constructor() {
        this.initialize();
    }

    initialize() {
        this.foo = 0;
    }
}
```


3. 更便利的与ECMAScript模块的互通性

供了一个新的编译选项 --esModuleInterop, 如果你使用Babel，Webpack或React Native，并期望与你以往使用地不同的导入行为。 【ECMAScript模块在ES2015里才被标准化，在这之前，JavaScript生态系统里存在几种不同的模块 格式，它们工作方式各有不同】

参考：[更便利的与ECMAScript模块的互通性](https://www.tslang.cn/docs/release-notes/typescript-2.7.html)



4. unique symbol类型和常量名属性

unique symbols是 symbols的子类型，仅可通过调用 Symbol()或 Symbol.for()或由明确的类型注释生成。 它们仅出现在常量声明和只读的静态属性上，并且为了引用一个存在的 unique symbols类型，你必须使用 typeof操作符。 每个对 unique symbols的引用都意味着一个完全唯一的声明身份。

```typescript
const Foo = Symbol("Foo");
const Bar = Symbol("Bar");

let x = {
    [Foo]: 100,
    [Bar]: "hello",
};

let a = x[Foo]; // has type 'number'
let b = x[Bar]; // has type 'string'
```

TypeScript可以追踪到 x拥有使用符号 Foo和 Bar声明的属性，因为 Foo和 Bar被声明成常量。 TypeScript利用了这一点，让 Foo和 Bar具有了一种新类型： unique symbols。


5. --watch模式下具有更简洁的输出. 更漂亮的 --pretty输出

- --watch模式下进行重新编译后会清屏
- --pretty标记可以让错误信息更易阅读和管理


6. 数字分隔符

TypeScript 2.7支持ECMAScript的数字分隔符提案。 这个特性允许用户在数字之间使用下划线（_）来对数字分组（就像使用逗号和点来对数字分组那样）。

```typescript
// Constants
const a = 8.957_551_787e9; // N-m^2 / C^2
const b = 6.626_070_040e-34; // J-s
const c = 867_5309; // C-A-L^2

// 二进制，十六进制
let d = 0b0010_1010;
let e = 0xC0FFEE_F00D_BED;
let f = 0xF0_1E;

console.log(a, b, c, d, e, f);
// 8957551787 6.62607004e-34 8675309 42 3395287326448621 61470
```


7. 固定长度元组

TypeScript 2.6之前， [number, string, string]被当作 [number, string]的子类型。 这是由于TypeScript的结构性类型系统而造成的, 然而却忽略了元祖组长度的问题。

元组类型会考虑它的长度，不同长度的元组不再允许相互赋值。 它通过数字字面量类型实现，因此现在可以区分出不同长度的元组了。


8. in操作符细化和精确的 instanceof

instanceof操作符现在利用继承链而非依赖于结构兼容性， 能更准确地反映出 instanceof操作符在运行时的行为。 这可以帮助避免一些复杂的问题，当使用 instanceof去细化结构上相似（但无关）的类型时。

in操作符现在做为类型保护使用，会细化掉没有明确声明的属性名。

```typescript
interface A { a: number };
interface B { b: string };

function foo(x: A | B) {
    if ("a" in x) {
        return x.a;
    }
    return x.b;
}
```


9. 更智能的对象字面量推断

对于 `let foo = someTest ? { value: 42 } : {};` 来讲, TypeScript会查找 { value: number }和 {}的最佳超类型，结果是 {}.

从2.7版本开始，TypeScript会“规范化”每个对象字面量类型记录每个属性， 为每个 undefined类型属性插入一个可选属性，并将它们联合起来。

foo的最类型是 { value: number } | { value?: undefined }
