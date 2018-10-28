# [TS 2.8](https://www.tslang.cn/docs/release-notes/typescript-2.8.html)

1. 有条件类型: `T extends U ? X : Y`

请注意： 上面的类型意思是，若T能够赋值给U，那么类型是X，否则为Y。所以等价为： `(T extends U) ? X : Y`

```typescript
type TypeName<T> =
    T extends string ? "string" :
    T extends number ? "number" :
    T extends boolean ? "boolean" :
    T extends undefined ? "undefined" :
    T extends Function ? "function" :
    "object";

type T0 = TypeName<string>;  // "string"
type T1 = TypeName<"a">;  // "string"
type T2 = TypeName<true>;  // "boolean"
type T3 = TypeName<() => void>;  // "function"
type T4 = TypeName<string[]>;  // "object"
```

2. 预定义的有条件类型

TypeScript 2.8在lib.d.ts里增加了一些预定义的有条件类型：

- Exclude<T, U> -- 从T中剔除可以赋值给U的类型。
- Extract<T, U> -- 提取T中可以赋值给U的类型。
- NonNullable<T> -- 从T中剔除null和undefined。
- ReturnType<T> -- 获取函数返回值类型。
- InstanceType<T> -- 获取构造函数类型的实例类型。

[code](../code/update/update2.8/update.1.ts)


3. 改进对映射类型修饰符的控制

映射类型支持在属性上添加readonly或?修饰符，但是它们不支持移除修饰符。 这对于同态映射类型有些影响，因为同态映射类型默认保留底层类型的修饰符。

TypeScript 2.8为映射类型增加了增加或移除特定修饰符的能力。 特别地，映射类型里的readonly或?属性修饰符现在可以使用+或-前缀，来表示修饰符是添加还是移除。

```typescript
type MutableRequired<T> = { -readonly [P in keyof T]-?: T[P] };  // 移除readonly和?
type ReadonlyPartial<T> = { +readonly [P in keyof T]+?: T[P] };  // 添加readonly和?
```

4. 改进交叉类型上的keyof

TypeScript 2.8作用于交叉类型的keyof被转换成作用于交叉成员的keyof的联合。 换句话说，keyof (A & B)会被转换成keyof A | keyof B。 这个改动应该能够解决keyof表达式推断不一致的问题。

```typescript
type A = { a: string };
type B = { b: string };

type T1 = keyof (A & B);  // "a" | "b"
type T2<T> = keyof (T & B);  // keyof T | "b"
type T3<U> = keyof (A & U);  // "a" | keyof U
type T4<T, U> = keyof (T & U);  // keyof T | keyof U
type T5 = T2<A>;  // "a" | "b"
type T6 = T3<B>;  // "a" | "b"
type T7 = T4<A, B>;  // "a" | "b"
```

5. 原型赋值

你可以把一个对象字面量直接赋值给原型属性。独立的原型赋值也可以：

```typescript
var C = function (p) {
    this.p = p;
};
C.prototype = {
    m() {
    console.log(this.p);
    }
};
C.prototype.q = function(r) {
    return this.p === r;
};
```
