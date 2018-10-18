# 泛型（Generics）

> 延迟处理耦合逻辑

软件工程中，我们不仅要创建一致的定义良好的API，同时也要考虑可重用性。

组件不仅能够支持当前的数据类型，同时也能支持未来的数据类型，这在创建大型系统时为你提供了十分灵活的功能。

1. 基础语法和使用

- Q： 如果某个函数或者操作在定义时不能确定参数或者返回值的类型该怎么办？

- A1: any 大法好。
- A2: 干脆不写类型, 就好像没用过 TS 一样。
- A3: 泛型。

```typescript
function identity<T>(arg: T): T {
    return arg;
}
// 泛型类型。
let myIdentity: <T>(arg: T) => T = identity;
// 泛型并不是具体类型， 所以可以理解为类型占位, 还可以这么赋值
let myIdentity: <U>(arg: U) => U = identity;
// 或者这么写， 实际上这个类型是一个接口的字面量
let myIdentity: {<T>(arg: T): T} = identity;

// 接口泛型改进方案: 不再描述泛型函数，而是把非泛型函数签名作为泛型类型一部分
interface GenericIdentityFn<T> {
    (arg: T): T;
}
实际上这也是非常漂亮的操作，
let myIdentity: GenericIdentityFn<number> = identity;
```

```typescript
// T 帮助我们捕获用户传入的类型
function identity<T>(len: T): T {
    // error: 类型“T”不可转换为类型“number”。
    // const P: any = <number>len * <number>len;

    // 事实上使用起来没有那么自在。很多类型不能断言到具体类型，不得不将其 any 化。
    // 其实与其转成 any 还不如使用 any 或者 直接不写类型。徒增复杂度。
    const P: any = <any>len * <any>len;
    return P;
}

// 明确的指定了T是string类型，并做为一个参数传给函数
let iden = identity<number>(10);
// 第二种方法更普遍。利用了类型推论 -- 即编译器会根据传入的参数自动地帮助我们确定T的类型.
// 官方说： 类型推论帮助我们保持代码精简和高可读性，「高可读性」 我不认同。
iden = identity(10);
```
上述代码存在一个很大的问题是： 我是用泛型定义函数后，函数体的实现却显得很不自由。简单的操作都有很多限制，考虑类型和转换等问题。

使用泛型创建像identity这样的泛型函数时，编译器要求你在函数体必须正确的使用这个通用的类型。 换句话说，你必须把这些参数当做是任意或所有类型。

> 场景

实际上这个问题很重要，很多特性需要特定场景中处理会产生非常强大的效果， 泛型就是如此。

实际上我们上面栗子的问题在于，泛型本身是一种延迟获取的类型, 所以说如果泛型和具体的类型处理出现在同一个地方，则你不得不忙于处理各种可能的情况，或者取巧的将其转换成 any，不仅没有意义，还会得到一个很不合理的设计： 集抽象与具体于一身的操作，令人窒息。且看正确打开方式：

```typescript
// 泛型和实现分离
interface Animal<T, U> {
    eat(food: T): U;
}

// 提供了具体类型然后去写逻辑则不用写出一堆毫无意义的代码。
class Dog implements Animal<Food, string> {
    eat(food: Food): string {
        return food.name;
    }
}

class Food {
    constructor(public name: string) {}
}

const eatWhat = new Dog().eat(new Food('骨头'));

console.log(eatWhat);
```

同理利用函数和函数表达式也能实现函数面临的泛型问题。代码参考： [generics 1](./code/generics/generics.1.ts)



2. 在泛型里使用类类型

在TypeScript使用泛型创建工厂函数时，需要引用构造函数的类类型。比如
```typescript
function create<T>(c: {new(): T; }): T {
    return new c();
}
```


3. 使用原型属性推断并约束构造函数与类实例的关系。

[generics 2](./code/generics/generics.2.ts)

---

## 注意
1. 泛型往往是在实例化或者调用时提供类型，所以静态方法不能够使用泛型类型。
