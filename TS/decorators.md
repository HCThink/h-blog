# decorators

> 独立的增强器。

Javascript里的装饰器目前处在 建议征集的第二阶段，但在TypeScript里已做为一项实验性特性予以支持。

注意  装饰器是一项实验性特性，在未来的版本中可能会发生改变。


1. 基础语法

装饰器是一种特殊类型的声明，它能够被附加到类声明，方法， 访问符，属性或参数上。 装饰器使用 @expression这种形式，expression求值后必须为一个函数，它会在运行时被调用，被装饰的声明信息做为参数传入。

当多个装饰器应用于一个声明上，它们求值方式与复合函数相似。当复合f和g时，复合的结果(f . g)(x)等同于f(g(x)

当多个装饰器应用在一个声明上时按照如下规则执行：
- 由上至下依次对装饰器表达式求值。
- 求值的结果会被当作函数，由下至上依次调用。

这个执行顺序很有意思，如下的代码输出 则为： f() - g() - g()() - f()()

源文件：[decorators1 ts](./code/decorators/decorators.1.ts)，
编译： [decorators1 js](./code/decorators/decorators.1.js)

```typescript
function f(): (...param) => void {
    console.log("f(): evaluated");
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("f(): called");
    }
}

function g(): (...param) => void {
    console.log("g(): evaluated");
    /**
     * 被装饰成员
     * 成员名称
     * 属性描述符
     */
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log(target, propertyKey, descriptor);
        console.log("g(): called");
    }
}

class C {
    @f()
    @g()
    method(a: string, b: number): void {
        console.log("method(): called");
    }
}

// 注意并没有调用 method。可见装饰器调用时机并非被装饰对象调用时期
// f(): evaluated
// g(): evaluated
// g(): called
// f(): called

```

2. 装饰器执行时机

我们看看编译之后的代码

```typescript
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
            // 装饰器返回函数执行
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var decorators;
(function (decorators) {
    function f() {
        console.log("f(): evaluated");
        return function (target, propertyKey, descriptor) {
            console.log("f(): called");
        };
    }
    var C = /** @class */ (function () {
        function C() {}
        C.prototype.method = function (a, b) {
            console.log("method(): called");
        };
        __decorate([
            // 装饰器在方法此时执行，并把返回的函数传入 __decorate 中执行
            f()
        ], C.prototype, "method", null);
        return C;
    }());
})(decorators || (decorators = {}));

```

从上面就可以看出来，装饰器在定义时执行，紧接着获取被装饰对象的基本信息和属性描述符，传递给装饰器返回的函数继续执行。

实际上整个过程并没有明显的干预原函数输出输出的途径。因为他的执行时机并不在被装饰函数调用的时候。


3. 尝试增强方法装饰器

> 思路： 方法装饰器会被注入 类原型， 方法名，方法描述等。可以利用原型去替换，同时装饰器允许 bind ，也可以 bind 不同对象进行一些操作。

但是没成功。

源文件：[decorators2 ts](./code/decorators/decorators.2.ts)，
编译： [decorators2 js](./code/decorators/decorators.2.js)

没成功原因可参考编译后文件： TS 会生成一个 `__decorate` 的包装函数，这个函数是是一个装饰器执行器。在函数return 部分有这样一段代码

```typescript
return c > 3 && r && Object.defineProperty(target, key, r), r;
```

这会将被装饰函数重新绑回原型对象。这应该是 TS 出于对安全的考虑，因为装饰器可以由外界提供，如果他能做到截获已有函数，就能拿到内部状态包含参数，返回值等一些信息，虽然能实现很强大的功能，但是感觉有些不安全。

但想想其实也没什么吧，不用装饰器，直接用 prototype 截获一些数组，string 之类的方法，也可以拿到很多数据。

__Date: 2018.10.24日，修正__

实际上我期望添加一种包装函数的效果： 通过装饰器达到 before deal， deal， after deal 的效果， 但是使用上述方案调试中，被 重新绑回原型 困扰了一段时间，导致没有仔细看明白这段代码，虽然后面发现了这个问题，还是决定讲原先的结论留下，做个警示。

在绑定 `Object.defineProperty(target, key, r)` 中第三个参数是这个属性的属性描述符。而属性描述符的 value 就是装饰器提供的函数，所以如果覆盖 value 则可以完成这种需求。

```typescript
descriptor.value = (...param) => {
    // before fn deal
    const dealData = fn.call(target, ...param);
    // after fn deal
}
```

源文件：[decorators2-1 ts](./code/decorators/decorators.2-1.ts)，
编译： [decorators2-1 js](./code/decorators/decorators.2-1.js)


4. 装饰器求值

- 参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个实例成员。
- 参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个静态成员。
- 参数装饰器应用到构造函数。
- 类装饰器应用到类。


5. 类装饰器

类装饰器在类声明之前被声明（紧靠着类声明）。 类装饰器应用于类构造函数，可以用来监视，修改或替换类定义。 类装饰器不能用在声明文件中( .d.ts)，也不能用在任何外部上下文中（比如declare的类）。

- 类装饰器表达式会在运行时当作函数被调用，类的构造函数作为其唯一的参数。
- 如果类装饰器返回一个值，它会使用提供的构造函数来替换类的声明。

注意  如果你要返回一个新的构造函数，你必须注意处理好原来的原型链[推荐： 匿名类 + 继承]。

[decorators3 ts](./code/decorators/decorators.3.ts)


6. 方法装饰器

方法装饰器声明在一个方法的声明之前（紧靠着方法声明）。 它会被应用到方法的 属性描述符上，可以用来监视，修改或者替换方法定义。 方法装饰器不能用在声明文件( .d.ts)，重载或者任何外部上下文（比如declare的类）中。

方法装饰器会被注入三个参数：`fn (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {}`
- 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
- 成员的名字。
- 成员的属性描述符。

如果方法装饰器返回一个值，它会被用作方法的属性描述符。

注意  如果代码输出目标版本小于ES5，属性描述符将会是undefined。装饰器的返回值也会被忽略

参考： [decorators1 ts](./code/decorators/decorators.1.ts)


7. 访问器[get/set]装饰器

访问器装饰器声明在一个访问器的声明之前（紧靠着访问器声明）。 访问器装饰器应用于访问器的 属性描述符并且可以用来监视，修改或替换一个访问器的定义。 访问器装饰器不能用在声明文件中（.d.ts），或者任何外部上下文（比如 declare的类）里。

注意  TypeScript不允许同时装饰一个成员的get和set访问器。取而代之的是，一个成员的所有装饰的必须应用在文档顺序的第一个访问器上。这是因为，在装饰器应用于一个属性描述符时，它联合了get和set访问器，而不是分开声明的。

形式参考方法装饰器, get set 也是方法。


8. 属性装饰器

属性装饰器声明在一个属性声明之前（紧靠着属性声明）。 属性装饰器不能用在声明文件中（.d.ts），或者任何外部上下文（比如 declare的类）里。

属性装饰器表达式会在运行时当作函数被调用，传入下列2个参数：

- 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
- 成员的名字。

注意  属性描述符不会做为参数传入属性装饰器，这与TypeScript是如何初始化属性装饰器的有关。 因为目前没有办法在定义一个原型对象的成员时描述一个实例属性，并且没办法监视或修改一个属性的初始化方法。返回值也会被忽略。因此，属性描述符只能用来监视类中是否声明了某个名字的属性。

官方的栗子在最新版的 `reflect-metadata` 上已经不能正常运行了。

参考： [decorators4 ts](./code/decorators/decorators.4.ts)


9. 参数装饰器

参数装饰器声明在一个参数声明之前（紧靠着参数声明）。 参数装饰器应用于类构造函数或方法声明。 参数装饰器不能用在声明文件（.d.ts），重载或其它外部上下文（比如 declare的类）里。

参数装饰器表达式会在运行时当作函数被调用，传入下列3个参数：

- 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
- 成员的名字。
- 参数在函数参数列表中的索引。

注意  参数装饰器只能用来监视一个方法的参数是否被传入。参数装饰器的返回值会被忽略。

参考： [decorators5 ts](./code/decorators/decorators.5.ts)


10. 元数据

一些例子使用了reflect-metadata库来支持实验性的metadata API。 这个库还不是ECMAScript (JavaScript)标准的一部分。 然而，当装饰器被ECMAScript官方标准采纳后，这些扩展也将被推荐给ECMAScript以采纳。

注意  装饰器元数据是个实验性的特性并且可能在以后的版本中发生破坏性的改变（breaking changes）。

此部分会在 [reflect-metadata lib](../source/reflect-metadata/readme.md) 中进行解析。
