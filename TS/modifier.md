# 修饰符

## 访问权限修饰符：
`public[default], protect[子类], private`

- 修饰作用： 参考 class.md [「访问权限修饰符」](./class.md) 章节

- 修饰范围： 类成员（属性， 构造， 方法， __参数属性__）。不可修饰接口成员

参数属性: 【只允许在构造函数实现中使用参数属性。】

> 参数属性是一种简化的写法。
```typescript
// 如下是 public。 private， protected 同理。
class P {
    constructor(public a: number) {}

    // error : 只允许在构造函数实现中使用参数属性。
    name(public a: number): void {}
}
new P(1).a;

// 等价于
class P1 {
    public a: number
    constructor(a: number) {
        this.a = a;
    }
}
new P(1).a;
```


## 只读修饰符：
`readonly`

- 修饰作用： 只读

- 修饰范围： 类, 接口属性. ["readonly" 修饰符仅可出现在属性声明或索引签名中。]

- 注意点：
    - 只读属性必须在声明时或构造函数里被初始化。
    - readonly vs const： 最简单判断该用readonly还是const的方法是看要把它做为变量使用还是做为一个属性。 做为变量使用的话用 const，若做为属性则使用readonly。

- 只带有 get 不带有 set 的存取器自动被推断为 readonly


## 类修饰符

抽象类： `abstract`

- 修饰作用： 参考 class.md [「抽象类」](./class.md) 章节


## static

- 修饰作用： 参考 class.md [「静态成员」](./class.md) 章节

- 修饰范围： 类, 接口属性. ["readonly" 修饰符仅可出现在属性声明或索引签名中。]

- 注意点：静态成员可以被继承


## 泛型
`<T>`

- 修饰作用： 延迟提供类型, 参考 [「泛型」](./Generics.md)

- 修饰范围： 类，接口，方法, 函数

- 注意点：
    - 修饰类和接口时， 为类成员共有。
    - 不要乱用。用的时候理清楚抽象和实现。



## 模块化关键字

1. import

2. export
- 修饰作用： 参考 module.md [「export」](./module.md) 章节
- 修饰范围： 任何声明（比如变量，函数，类，类型别名或接口）, 导出语句, 导出引入模块（export xx from 'xx/xx'）。


----


## 修饰符顺序

1. 访问权限修饰符 > static  > 只读修饰符 => `private static readonly xx: any;`
