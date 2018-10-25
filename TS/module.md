# 模块

参考： Native ECMAScript 2015 +

> 代码组织，分拆，管理

模块在其自身的作用域里执行，而不是在全局作用域里；因此模块里的变量，函数，类等等在模块外部是不可见的，

除非你明确地使用export形式之一导出它们。

相反，如果想使用其它模块导出的变量，函数，类，接口等的时候，你必须 import 去获取该文件的 export。

任何包含顶级import或者export的文件都被当成一个模块, 两个模块之间的关系是通过在文件级别上使用imports和exports建立的。


---


## 注意：

1. “内部模块”现在称做“命名空间”。 “外部模块”现在则简称为“模块”
2. 模块使用模块加载器去导入其它的模块。 在运行时，模块加载器的作用是在执行此模块代码前去查找并执行这个模块的所有依赖。


---


## export

1. 导出
- export 修饰声明语句

```typescript
// 声明
export interface StringValidator {
    isAcceptable(s: string): boolean;
}

export const numberRegexp = /^[0-9]+$/;

export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string): boolean { return true; };
}

// 重命名导出
export {
    numberRegexp as nReg
};

// error
// export {
//     name: '',
//     age: 10
// }

// 重新导出
export * from '../xx'
```

2. 默认导出

- 每个模块都可以有至多一个default导出。
- 类和函数声明可以直接被标记为默认导出。 标记为默认导出的类和函数的名字是可以省略的。

```typescript
export default $;
```


---


## import

__注意__: 如果你是用 deno 执行 TS 文件，import 需要明确指定文件后缀，`import xx.ts`。

```typescript
export const ZipCodeValidator = { /* ... */ };

import { ZipCodeValidator } from "./ZipCodeValidator";
// as
import { ZipCodeValidator as zv } from "./ZipCodeValidator";
// or
import * as zcv "./ZipCodeValidator";
zcv.ZipCodeValidator    // ...

// 不关注导出： 一些模块会设置一些全局状态供其它模块使用
import "./commonInit";

// 导入默认导出
// export default $;
import $ from 'jquery';
```

import 没有强制位置, 一个在编译阶段处理，一个是执行阶段代码。可以理解为变量提升。
```typescript
console.log(PI);    // 3.1415....
import {PI} from './module_export.1.ts'
```


[综合 demo](./code/module/demo/main.ts)

已经编译到同目录下的 `./build/` 中了。


---

## 兼容语法

eg: `export =`  and `import fs = require('fs')`

CommonJS和AMD都有一个exports对象的概念, 但和 TS 的模块并不相互兼容。 TypeScript模块支持 `export = ` 语法以支持传统的CommonJS和AMD的工作流模型。

- export =语法定义一个模块的导出对象。 它可以是类，接口，命名空间，函数或枚举。
- 若要导入一个使用了export =的模块时，必须使用TypeScript提供的特定语法import module = require("module")。

可以使用 --module 编译到不同规范看 TS 的模块对于到不同规范的情况。

对于Node.js来说，使用--module commonjs； 对于Require.js来说，使用--module amd   `tsc --module commonjs xxx`

```typescript
// file a.ts
export const PI = Math.PI;

// const PI = Math.PI;
// export = PI;

// file b.ts
// import PI from './module_export.1.ts';
import exObj = require('./module_export.1.ts');

console.log(exObj.PI);
```

注意：
1. export = 和 export 不共存， error： 不能在具有其他导出元素的模块中使用导出分配
2. 混搭： import = require 可以导入 export 和 export =. import 也同理, 但是导出的使用上稍有区别。不建议混搭
3. require 并不是关键字， 他只在 import = requrie 这个模式下被识别，不要单独使用它。



---


## 可选的模块加载和其它高级加载场景

> 条件加载模块

先看看一些 TS 编译相关的实现：

- 编译器会检测是否每个模块都会在生成的JavaScript中用到。 如果一个模块标识符只在类型注解部分使用，并且完全没有在表达式中使用时，就不会生成 require这个模块的代码。 省略掉没有用到的引用对性能提升是很有益的，并同时提供了选择性加载模块的能力。

这种模式的核心是 `import id = require("...") `语句可以让我们访问模块导出的类型。 模块加载器会被动态调用（通过 require），就像下面if代码块里那样。 它利用了省略引用的优化，所以模块只在被需要时加载。 为了让这个模块工作，一定要注意 import定义的标识符只能在表示类型处使用（不能在会转换成JavaScript的地方）。

为了确保类型安全性，我们可以使用typeof关键字。 typeof关键字，当在表示类型的地方使用时，会得出一个类型值，这里就表示模块的类型。


// TODO 1. 可选的模块加载和其它高级加载场景, 2. 使用其它的JavaScript库


---


## 创建模块结构指导

1. 尽可能地在顶层导出. 嵌套层次过多会变得难以处理，因此仔细考虑一下如何组织你的代码. 突出表现在两个点： 避免直接导出静态方法， 避免导出和命名空间重叠的代码组织方式。
2. 如果仅导出单个 class 或 function，使用 export default.
3. 如果要导出多个对象，把它们放在顶层里导出, 同时导入的时候，明确地列出导入的名字
```typescript
// MyThings.ts
export class SomeType { /* ... */ }
export function someFunc() { /* ... */ }

// Consumer.ts
import { SomeType, someFunc } from "./MyThings";
let x = new SomeType();
```
4. 导出模块的同时不要重叠使用命名空间
5. 批量导入
```typescript
// MyThings.ts
export class Dog { ... }
export class Cat { ... }
export class Tree { ... }
export class Flower { ... }

// Consumer.ts
import * as myLargeModule from "./MyLargeModule.ts";
```


## 使用重新导出进行扩展

类似高阶函数，高阶组件的处理方案： 你可能经常需要去扩展一个模块的功能。 JS里常用的一个模式是JQuery那样去扩展原对象。 如我们之前提到的，模块不会像全局命名空间对象那样去 合并。 推荐的方案是 不要去改变原来的对象，而是导出一个新的实体来提供新的功能。

方法实践上： 使用 extend 去扩展一个子类是最佳实践，分模块可以实现开闭。但是情分清： is A 和 has A。

这是个恒久话题，继承很好用，但是同回调一样不能乱用，典型的例子是： 企鹅不该直接派生自可飞行的鸟类。


## 错误的使用。

- 文件的顶层声明是export namespace Foo { ... } （删除Foo并把所有内容向上层移动一层）
- 文件只有一个export class或export function （考虑使用export default）
- 多个文件的顶层具有同样的export namespace Foo { （不要以为这些会合并到一个Foo中！）
