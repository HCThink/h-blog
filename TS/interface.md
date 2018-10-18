# Interface

> 规范描述。

基本场景：

interface 很重要的一个作用，就是类型规范，简单来说就是用来描述变量，字面两结构，参数结构，返回值结构, 函数结构等等。
如果你需要强制别人提供给你一个格式固定的数据，那么就声明一个接口去约束这种传递关系。

接口如果不能被实现作用将会大大降低，作为可实现的接口，他可以描述非常抽象的级别。后面会有代码去说明。

问题：

额外属性检查： 接口作为数据规范时，校验非常严格，你只能提供接口描述的部分，必须的字段不能少，同时呢也不能超出接口的描述。
也就是说他需要 a,b,c 三个字段，你只能提供 a, b, c, 如果你提供 a,b,c,d 将不被允许。

1. 基本语法 & 可选属性: `xx?: ''`
```typescript
interface LabelledValue {
    label: string;
    // 可选属性
    desc?: string;
}

function printLabel(labelledObj: LabelledValue) {
    console.log(labelledObj.label);
}

printLabel({ label: 'label' });

let myObj: LabelledValue = { label: "Size 10 Object", desc: 's' };
printLabel(myObj);

// error 对象文字可以只指定已知属性，并且“a”不在类型“LabelledValue”中
let myObj: LabelledValue = { label: "Size 10 Object", a: 1 };
```

对数据的这种强约束可以避免很多问题，实际上大多数时候我们在设计之初完全能够理清楚自己需要什么。但是如果是特殊情况呢？ typescript 提供了几种方案去跳过, 断言部分提供了思路。我们再梳理一次.(仅仅列举赋值时的情况，函数参数，返回值等凡事可以用接口约束的场景都可以类推)

```typescript
interface LabelledValue {
    label: string;
    desc?: string;
}

let t1: LabelledValue = <LabelledValue>{ label: '', b: 1 };
let t2: LabelledValue = { label: '', b: 1 } as LabelledValue;

// 这可能会让你感到惊讶，它就是将这个对象赋值给一个另一个变量： 因为 squareOptions不会经过额外属性检查，所以编译器不会报错。
let temp = { label: '', b: 1 };
let t3: LabelledValue = temp;

// 字符串索引签名: 上述方式具有特殊性，没有普遍性，如果一个某个结构在设计之初不太好确定构成，那么最好让接口容纳性更好一些
// 你可能认为这是一劳永逸的方案，如果每个接口都设计成这样那约束的意义也就失去了。
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}
```

要留意，在像上面一样的简单代码里，你可能不应该去绕开这些检查。 对于包含方法和内部状态的复杂对象字面量来讲，你可能需要使用这些技巧，但是大部额外属性检查错误是真正的bug。

2. 函数描述： 定义单函数规范
```typescript
interface tfunTmpl {
    (a: number, b: boolean, c: string): string;
}
// 依据位置匹配类型而不是名字匹配。
// 如果实际函数没有提供类型则会依据接口推测类型。
// 实际函数参数类型可以是 Any， 一样会被推测为接口对应位置的参数
let sf: tfunTmpl = (a1: number, b1: any, c) => b1 ? `${a1}` : c;

sf(10, true, 'c');
```

3. 可检索索引, 感觉有点鸡肋
```typescript
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];

// ----

class Animal {
    name: string;
}
class Dog extends Animal {
    breed: string;
}

// 错误：使用数值型的字符串索引，有时会得到完全不同的Animal!
interface NotOkay {
    [x: number]: Animal;
    [x: string]: Dog;
}

// ---

interface ReadonlyStringArray {
    readonly [index: number]: string;
}
let myArray: ReadonlyStringArray = ["Alice", "Bob"];
myArray[2] = "Mallory"; // error!
```

4. 最喜欢的功能：Class Types (Implementing an interface)

> 与C#或Java里接口的基本作用一样，TypeScript也能够用它来明确的强制一个类去符合某种契约。

- 普通类实现某个接口就必须实现接口规定的行为。
- 接口描述了类的公共部分[接口成员不允许添加访问权限描述符（public, private, protected）]，而不是公共和私有两部分。 它不会帮你检查类是否具有某些私有成员。
- 实现类可扩展, implements 接口没有额外属性检查。
- 可实现多个接口
- 接口可以继承接口，注意注意： __接口继承接口允许多继承__ 类继承是单继承

[base1 code](./code/interface/interface.1.ts)

[base2 code](./code/interface/interface.2.ts)

[base3 code](./code/interface/interface.3.ts)

5. 类静态部分与实例部分的区别

> 当一个类实现了一个接口时，只对其实例部分进行类型检查。 constructor存在于类的静态部分，所以不在检查的范围内。

```typescript
interface ClockConstructor {
    new (hour: number, minute: number);
}

// error 这里会产生一个错误， constructor存在于类的静态部分
class Clock implements ClockConstructor {
    currentTime: Date;
    constructor(h: number, m: number) { }
}
```

6. 混合类型

> JavaScript其动态灵活的特点，有时你会希望一个对象可以同时具有上面提到的多种类型。

> 在使用JavaScript第三方库的时候，你可能需要像下面那样去完整地定义类型。

```typescript
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter(): Counter {
    let counter = <Counter>function (start: number) { };
    counter.interval = 123;
    counter.reset = function () { };
    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

7. 接口继承类. 接口同样会继承到类的 private 成员

> 说实话有点无语，如果接口是描述，意味着接口更加抽象，类则是实际的对象模板，属于具体。 具体可以实现抽象，这很合理。抽象又可以继承接口， 这不仅不可理，而且没有逻辑啊？private 成员也可以继承了。

官方表述是：
> 当接口继承了一个类类型时，它会继承类的成员但不包括其实现。 就好像接口声明了所有类中存在的成员，但并没有提供具体实现一样。 接口同样会继承到类的private和protected成员。 这意味着当你创建了一个接口继承了一个拥有私有或受保护的成员的类时，这个接口类型只能被这个类或其子类所实现（implement）。

> 当你有一个庞大的继承结构时这很有用，但要指出的是你的代码只在子类拥有特定属性时起作用。 这个子类除了继承至基类外与基类没有任何关系

这太扯淡了， 完全不能认同， 参考 java 。
```typescript
class Control {
    private state: any;
}

interface SelectableControl extends Control {
    select(): void;
}

class Button extends Control implements SelectableControl {
    select() { }
}

class TextBox extends Control {
    select() { }
}

// 错误：“Image”类型缺少“state”属性。
class Image implements SelectableControl {
    select() { }
}

class Location {

}
```

8. 接口声明都是 public（如下不讨论数据接口）

接口中声明的字段都是 public ，所以接口作为继承顶级规范的时候， 我会避免在里面声明属性, 只用做行为声明。

> 因为属性是私有的，不管他是不是通属于某个类别，比如名字， 人都有名字，但是他是针对个体人而言的， 人类有名字么？
> 行为是共享的。

另一方面，基本上实际场景中 public 的属性不太多， 加上 ts 的另一个限制：

- 接口中的属性只能是 public ，不利于很多访问控制逻辑的开展。
- 同一属性的 get set 只能用同样的访问修饰符。

这就导致在接口中声明属性往往会给后面的设计带来比较大的麻烦， 而且会导致接口设计需要思索很多实例方面的情况，往往导致接口不够抽象。

建议的做法是，如果可能，在抽象类中声明属性，并做初始化，这样既避免了每个实现类重复的构造赋值， 又能将相对具体的行为从接口中拿出来，同时访问控制逻辑也变得很容易。

尽量避免在接口中声明属性，当然也看场景。
