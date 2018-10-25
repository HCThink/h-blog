# Advanced Types: 高级类型

> 类型约束扩展


### 交叉类型 U & T

交叉类型是将多个类型合并为一个类型, 我们大多是在混入（mixins）或其它不适合典型面向对象模型的地方看到交叉类型的使用

- 如果一个值是联合类型，我们只能访问此联合类型的所有类型里共有的成员。

[AT 1](./code/AT/at.1.ts)


### 联合类型 U | T

联合类型表示一个值可以是几种类型之一

- 如果一个值是联合类型，我们只能访问此联合类型的所有类型里共有的成员。

[AT 2](./code/AT/at.2.ts)


### 类型区分和保护

联合类型存在一个问题，只能访问共有成员，这显然不合理。我们怎么访问实际实例的成员呢？

```typescript
function getSmallPet(): Fish | Bird {
    // ...
}
```

1. 断言
```typescript
let pet = getSmallPet();

if ((<Fish>pet).swim) {
    (<Fish>pet).swim();
} else {
    (<Bird>pet).fly();
}
```

2. 自定义的类型保护

要定义一个类型保护，我们只要简单地定义一个函数，它的返回值是一个 类型谓词：

每当使用一些变量调用 isFish时，TypeScript会将变量缩减为那个具体的类型，只要这个类型与变量的原始类型是兼容的。


```typescript
// pet is Fish就是类型谓词
function isFish(pet: Fish | Bird): pet is Fish {
    return (<Fish>pet).swim !== undefined;
}

// 类型谓词
if (isFish(pet)) {
    // 每当使用一些变量调用 isFish时，TypeScript会将变量缩减为那个具体的类型，只个类型与变量的原始类型是兼容的。
    // 不需要断言
    pet.swim();
} else {
    // 注意TypeScript不仅知道在 if分支里 pet是 Fish类型； 它还清楚在 else分支里，一定 不是 Fish类型，一定是 Bird类型。
    pet.fly();
}
```

[AT 3](./code/AT/at.3.ts)


3.  类型谓词简化类型重载

- 复杂版本： 需要配合很多个无意义的类型谓词函数

```typescript
function isNumber(x: any): x is number {
    return typeof x === "number";
}

function isString(x: any): x is string {
    return typeof x === "string";
}

function padLeft(value: string, padding: string | number) {
    if (isNumber(padding)) {
        return Array(padding + 1).join(" ") + value;
    }
    if (isString(padding)) {
        // 类型谓词分支中，可以确认使用对应类型的操作
        return padding + value;
    }
    throw new Error(`Expected string or number, got '${padding}'.`);
}
```

- typeof: 触发类型保护。
- 人性化版本（TS 官方 doc 还故意买了个关子凸现自己做的比较人性化，这么鸡贼真是值得学习）。 贴出

原文：
『然而，必须要定义一个函数来判断类型是否是原始类型，这太痛苦了。 幸运的是，现在我们不必将 typeof x === "number"抽象成一个函数，因为TypeScript可以将它识别为一个类型保护。 也就是说我们可以直接在代码里检查类型了。』

> if 可以， switch 貌似有点问题

于是我们可以直接这么写：
```typescript
function padLeft(value: string, padding: string | number) {
    if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") {
        return padding + value;
    }
    throw new Error(`Expected string or number, got '${padding}'.`);
}
```
typeof 只能识别基础类型 "number"， "string"， "boolean"或 "symbol", 对象基本搞不定。

- instanceof 类型保护

上述「2. 自定义的类型保护」的实现就可以简化为如下代码：
```typescript
// 3. 自动类型保护机制
// instanceof 触发类型保护
if (pet instanceof Fish) {
    // 类型细化为 Fish
    pet.swim();
} else {
    // 类型细化为 Bird
    pet.fly();
}
```

。。。 尼玛，有这么好的方法为什么不早点拿出来。手动抓狂


4. 可以为null的类型

TypeScript具有两种特殊的类型， null和 undefined，默认情况下，类型检查器认为 null与 undefined可以赋值给任何类型。 null与 undefined是所有其它类型的一个有效值。

[null的发明者，Tony Hoare，称它为 价值亿万美金的错误](https://en.wikipedia.org/wiki/Null_pointer#History)。

```typescript
let n: string = null;
let z: string = undefined;

n = 'n';
n = null;
```

注意，按照JavaScript的语义，TypeScript会把 null和 undefined区别对待。 string | null， string | undefined和 string | undefined | null是不同的类型。

5. 类型保护和类型断言 [本章节 identifier! 这个后缀！号的语法没看明白在干什么。]

6. 类型别名

起别名不会新建一个类型 - 它创建了一个新 名字来引用那个类型。 给原始类型起别名通常没什么用，尽管可以做为文档的一种形式使用。

```typescript
type Name = string;
// 泛型别名
type NameResolver<T> = () => T;
type NameOrResolver = Name | NameResolver<Name>;
function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
        return n;
    } else {
        return n();
    }
}
const test = getName('test');
const testFn = getName(() => 'testFn');

console.log(test, ', ', testFn);
```

然而，类型别名不能出现在声明右侧的任何地方。

`type Yikes = Array<Yikes>; // error`

7. 接口 VS 别名

- 接口创建了一个新的名字，可以在其它任何地方使用。 类型别名并不创建新名字
- 类型别名不能被 extends和 implements（自己也不能 extends和 implements其它类型）

因为 软件中的对象应该对于扩展是开放的，但是对于修改是封闭的，你应该尽量去使用接口代替类型别名。

8. 可辩识联合: 联合类型优化

> 并非语法层面，而是处理具体问题的技巧

[AT 4](./code/AT/at.4.ts)

9. this 多态性。

实际上在继承结构中， this 依旧是动态寻址，依赖具体实现, 被类型约束。原来怎么用这里怎么用

10. 索引类型： [参考索引类型（Index types） 章节](https://www.tslang.cn/docs/handbook/advanced-types.html)

11. 映射类型： TODO
