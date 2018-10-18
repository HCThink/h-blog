# Class

> oop 基本单位

基本场景：

> 面向过程的编程遇到问题经常会思考输入和输出，以及对数据的处理。

> 面向对象的编程则倾向于将数据和对数据的处理组织成一个模板， 当你需要解决问题的时候， 通过模板实例化出一个具体的对象让他去处理。

传统的 javascript 是基于对象的。 es 高级版本虽然加上了 class 的语法糖。 不过大多数前端并不会用 oop 的思维去编程，原因是，别扭， 没必要， 习惯了函数式编程。

typescript 借鉴很多 oop 语言，提供了比较多的对 oop 语法层面的支持一一来看。


---


## 基本结构： class
```typescript
// 类声明
class Greeter {
    // 属性
    greeting: string;
    // 构造
    constructor(message: string) {
        this.greeting = message;
    }
    // 方法
    greet() {
        return "Hello, " + this.greeting;
    }
}
// 实例化
let greeter = new Greeter("world");
```


---


## 继承(override)

> 基础语法 类比 java c#

> 父类有构造，则子类构造里必须调用 super(...);，可以不在第一行， 但是一定在使用 this 之前。

> super 可以在子类任意方法中使用， 不局限于构造

> 和继承相伴的一定有 override。

[class 1](./code/class/class.1.ts)

[class 2](./code/class/class.2.ts)


---


## 访问权限修饰符: 作用域任何类成员，包含构造【单例】。

> public（defaule）， protected, private[外部不可访问，可配合 get set 实现访问修改]

TypeScript使用的是结构性类型系统。 当我们比较两种不同的类型时，并不在乎它们从何处而来，如果所有成员的类型都是兼容的，我们就认为它们的类型是兼容的。

然而，当我们比较带有 private或 protected成员的类型的时候，情况就不同了。 如果其中一个类型里包含一个 private成员，那么只有当另外一个类型中也存在这样一个 private成员， 并且它们都是来自同一处声明时，我们才认为这两个类型是兼容的。 对于 protected 成员也使用这个规则。

[class 3](./code/class/class.3.ts)

修饰符修饰普通属性和方法时的可访问性：
| 修饰符    | 本类内部 |  子类  |  外部  |
|  ------  | ------ | ------ | ------ |
| public   |    √   |    √   |    √   |
| protected|    √   |    √   |    ×   |
| private  |    √   |    ×   |    ×   |

修饰符修饰构造时可实例化： （ const xx = new x（））
| 修饰符    | 本类内部 |  子类  |  外部  |
|  ------  | ------ | ------ | ------ |
| public   |    √   |    √   |    √   |
| protected|    √   |    √   |    ×   |
| private  |    √   |不可被继承|    ×   |

[class 4](./code/class/class.4.ts)


---


## 存取器： getter/setter.

> 注意点：
1. "set" 访问器不能具有返回类型批注。
2. 存取器要求你将编译器设置为输出ECMAScript 5或更高。 不支持降级到ECMAScript 3。
3. 这在从代码生成 .d.ts文件时是有帮助的，因为利用这个属性的用户会看到不允许够改变它的值。

> 很多语言中推崇这样一种规范： 虽有的属性都设计成 private， 然后使用 getter/setter 实现存取。

有人说了你这不是多此一举么？确实，对于大多数形如这样的存取器确实在 【访问方式】 上和设计成 public 没有区别。
```typescript
class P {
    constructor(private _a: number) {}
    get a(): number {
        return this._a;
    }

    set a(_a: number) {
        this._a = _a;
    }
}

const p = new P(1);
console.log(p.a, p.a = 10, p.a);    // 1, 10, 10
```
但实际上是完全不同的理念，怎么理解呢？ 就好像别人想知道你的年收入，他有两种方案。
1. 直接看你的银行流水（就相当于你把薪水设计成 public， 别人就能看到）。
2. 向你打听你薪水， 就相当于调用你的 getSalary 方法。（因为是 private）

这时候呢如果你是方案一， 则他就直接知道了。
但如果设计成方案二， 你就可以根据问的人的熟悉度不同而返回一个处理过的结果给对应的人。这个处理过程则由你决定策略。

你会怎么设计呢？


---


## 静态成员

> 以上所有的讨论都针对类的实例成员【属性和方法。】

> 静态成员是类成员，不挂载在 this 上，和实例成员分属两个体系。

> 静态成员可以在不实例化的情况下使用，也就意味着不能使用 this， 因为没有实例。 __然而 js 并不是一般的语言（手动狗头）js 中一切皆对象, 类也是对象， 所以静态成员中不但能访问 this， 而且 this 指向类本身。__

> tsc 中静态方法和实例方法里都可以使用 this ，但是二者指向不同的上下文。

> 实例方法中可以访问静态成员，但是实例方法中的 this 指向实例，所以需要使用类点的方式去访问静态成员，

> 静态成员中无法访问实例成员。没有实例被初始化.

所谓的静态成员，在使用上表现为不用实例化就能使用的成员。

理解起来也很简单。在 js 中，想要实例化一个对象，方法之一是创建一个 function 作为模板，然后 new 去调用这个 function 就能产生实例， function 中所有挂载在 this 上的成员，都会成为实例化的对象的成员。

同时呢，函数除了作为模板外（类似于类）， 在 js 中也是一个对象。 所以就能在对象上挂载一些操作和属性，这也就是 js 中'类'的静态成员。
```typescript
function Dog(name, age) {
    this.name = name;
    this.age = age;
}
// 成员方法
Dog.prototype.gatekeeper = function () {
    console.log(`${this.name}: go away！`);
}
// 静态方法
Dog.legCount = 4;
Dog.run = function () {
    console.log(`running dog by ${Dog.legCount} legs`);
    // 静态方法中的 this 即是类对象本身。被 java 先入为主了， 一直以为静态方法中不能访问 this。
    console.log(`running dog by ${this.legCount} legs`);
}

Dog.run();                              // running dog by 4 legs
new Dog('dahuang', 4).gatekeeper();     // dahuang: go away！
```

tsc 实现这样一个基本结构代码如下：

[class 5](./code/class/class.5.ts)


### 静态成员 ** 继承 （高能）

静态成员存在于类本身上面而不是类的实例上.

> 静态成员可以被访问权限修饰符修饰， 表现和实例成员一致。

> __静态成员也可以被继承，继承方式、表现和实例成员一致。__

[class 6](./code/class/class.6.ts)


---


## 抽象类

抽象类做为其它派生类的基类使用。 它们一般不会直接被实例化。 不同于接口，抽象类可以包含成员的实现细节。

abstract 关键字是用于定义抽象类和在抽象类内部定义抽象方法。

抽象类的定位是介于接口和类之间，比接口具象，比实现类抽象, 同时包含抽象描述和具体实现。往往作为具体实现类和接口之间的'润滑剂'。

不能实例化

[abstract 6](./code/interface/interface.2.ts)

抽象类很重要的一个价值在于兼容接口变化，如果极端情况下接口扩展了，所有的子类直接实现接口的话，就悲剧了。所有子类都需要扩展。但是如果有一层抽象类的话， 就可以在这一层做通用的实现方案。

---


## 高级特性

### 类类型 & 反射

> 当你在TypeScript里声明了一个类的时候，实际上同时声明了很多东西。 首先就是类的 实例的类型。

> 当我们调用 new 后，便会得到一个类的实例。 这个构造函数也包含了类的所有静态属性。 换个角度说，我们可以认为类具有 实例部分与 静态部分这两个部分。

> 假设有 Person 类，使用 typeof Person 意思是取 Person 类的类型，而不是实例的类型，也就是构造函数的类型, 这个类型包含了类的所有静态成员和构造函数。

> 如果我们能获取到类类型，接着我们就可以操控这个类的属性， 并且使用修改后的类类型去实例化。

> 这个过程类似反射，但是 js 始终是函数式语言，函数式一等公民，所以这种情景下的反射并没有 java 中的反射给人感觉那么强大。 因为我们可以直接修改静态成员： Greeter.standardGreeting。

> TODO 如何修改或者包装类的实例成员？ 如果能拿到实例成员，才是真的强大。

> 瞎 jb 折腾 😂😂。

[类类型 + 泛型 demo](./code/generics/generics.2.ts)

[class 7](./code/class/class.7.ts)

类定义会创建两个东西：类的实例类型和一个构造函数。 因为类可以创建出类型，所以你能够在允许使用接口的地方使用类。

这也是接口可以继承类的根本原因, 虽说我觉得这是个徒增复杂度的功能。
```typescript
class Point {
    x: number;
    y: number;
}

interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```

### 多态

我最喜欢的功能， 没有之一。

[class 8](./code/class/class.8.ts)

在面向对象语言中，接口的多种不同的实现方式即为多态, 多态性是允许你将父对象设置成为一个或更多的他的子对象相等的技术，赋值之后，父对象就可以根据当前赋值给它的子对象的特性以不同的方式运作。

利用多态和接口配合可以写出非常抽象的上层实现。

[综合案例：接口定义规范+抽象类过度+实现类聚合复合](./code/polymorphism/src/main.ts)

但其实要理解一点和传统 oop 语言的差别：
TypeScript 使用的是结构性类型系统。 当我们比较两种不同的类型时，并不在乎它们从何处而来，如果所有成员的类型都是兼容的，我们就认为它们的类型是兼容的。

[class 9](./code/class/class.9.ts)

也就是说 TS 的多态并不是非要依托于继承关系之上。 总之如果学过其他的 oop 多态 ，则理解起来有些费劲。
